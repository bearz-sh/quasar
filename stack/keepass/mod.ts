import { homeConfigDir } from "../../path/os.ts";
import { ensureDirectory, exists, readFile, writeFile } from "../../fs/fs.ts";
import { get } from "../../os/env.ts";
import { secretGenerator } from "../../secrets/mod.ts";
import { basenameWithoutExtension, dirname, join } from "../../path/mod.ts";
import { equalsIgnoreCase } from "../../text/str.ts";
import { kdbx } from "./deps.ts";
export { kdbx };

export class KpDatabase {
    #file: string;
    #db: kdbx.Kdbx;

    constructor(file: string, db: kdbx.Kdbx) {
        this.#file = file;
        this.#db = db;
    }

    get rootGroup() {
        return this.#db.getDefaultGroup();
    }

    get db() {
        return this.#db;
    }

    getEntry(path: string, delimiter = "/") {
        const segments = path.split(delimiter);
        const title = segments.pop();
        if (!title || title.length === 0) {
            throw new Error("entry title must not be empty");
        }
        let target: kdbx.KdbxGroup = this.rootGroup;
        if (segments.length > 0) {
            target = this.getGroup(segments, delimiter);
        }

        let entry = target.entries.find((o) => {
            const t = o.fields.get("Title");
            let v = "";
            if (typeof t === "string") {
                v = t;
            } else if (t instanceof kdbx.ProtectedValue) {
                v = t.getText();
            }

            return title === v;
        });

        if (!entry) {
            entry = this.#db.createEntry(target);
            entry.fields.set("Title", title);
        }

        return entry;
    }

    getGroup(path: string | string[], delimiter = "/") {
        let target = this.rootGroup;
        const segments = Array.isArray(path) ? path : path.split(delimiter);
        for (let i = 0; i < segments.length; i++) {
            const n = segments[i];
            let found = false;
            for (let j = 0; j < target.groups.length; j++) {
                const g = target.groups[j];
                if (g.name === n) {
                    target = g;
                    found = true;
                    break;
                }
            }

            if (!found) {
                const ng = this.#db.createGroup(target, n);
                target = ng;
            }
        }

        return target;
    }

    findGroup(path: string | string[], ignoreCase = false, delimiter = "/") {
        let target = this.rootGroup;
        const segments = Array.isArray(path) ? path : path.split(delimiter);
        for (let i = 0; i < segments.length; i++) {
            const n = segments[i];
            let found = false;
            for (let j = 0; j < target.groups.length; j++) {
                const g = target.groups[j];
                if ((ignoreCase && equalsIgnoreCase(g.name, n)) || g.name === n) {
                    target = g;
                    found = true;
                    break;
                }
            }

            if (!found) {
                return undefined;
            }
        }

        return target;
    }

    findEntry(path: string, ignoreCase = false, delimiter = "/") {
        const segments = path.split(delimiter);
        const title = segments.pop();
        let target: kdbx.KdbxGroup | undefined = this.rootGroup;
        if (segments.length > 0) {
            target = this.findGroup(segments, ignoreCase);
            if (!target) {
                return undefined;
            }
        }

        return target.entries.find((o) => {
            const t = o.fields.get("Title");
            let v = "";
            if (typeof t === "string") {
                v = t;
            } else if (t instanceof kdbx.ProtectedValue) {
                v = t.getText();
            }

            return (ignoreCase && equalsIgnoreCase(title, v)) || title === v;
        });
    }

    static async create(file: string, creds: kdbx.Credentials, name?: string): Promise<KpDatabase> {
        name ??= basenameWithoutExtension(file);
        const dir = dirname(file);
        await ensureDirectory(dir);
        const kdb = kdbx.Kdbx.create(creds, name);
        kdb.setKdf(kdbx.Consts.KdfId.Aes);
        const db = new KpDatabase(file, kdb);
        await db.save();
        return db;
    }

    static async open(file: string, creds: kdbx.Credentials): Promise<KpDatabase> {
        const binaryDb = await readFile(file);
        const existingDb = await kdbx.Kdbx.load(binaryDb.buffer, creds);
        return new KpDatabase(file, existingDb);
    }

    async save() {
        const buffer = await this.#db.save();
        const dir = dirname(this.#file);
        await ensureDirectory(dir);
        await writeFile(this.#file, new Uint8Array(buffer));
    }
}

async function getOrCreateKey() {
    const dir = join(homeConfigDir(), "quasar");
    await ensureDirectory(dir);
    const keyFile = join(dir, "key.bin");

    if (await exists(keyFile)) {
        const key2 = await readFile(keyFile);
        return { key: key2, keyFile };
    }

    const key = secretGenerator.generateAsUint8Array(33);
    await writeFile(keyFile, key);
    return { key, keyFile };
}

export function createCredentials(secret: string | Uint8Array) {
    if (typeof secret === "string") {
        return new kdbx.Credentials(kdbx.ProtectedValue.fromString(secret));
    }
    return new kdbx.Credentials(kdbx.ProtectedValue.fromBinary(secret));
}

export async function getOrCreateDevKdbx() {
    const locations = [
        get("DEV_KEEPASS"),
        get("OneDrive"),
        join(homeConfigDir(), "quasar"),
    ];

    const dir = locations.find((o) => o && o.length > 0);
    if (!dir) {
        throw new Error(`Directory not found for keepass`);
    }
    const kdbxFile = join(dir, "quasar.kdbx");

    const { key } = await getOrCreateKey();
    const credentials = createCredentials(key);
    if (await exists(kdbxFile)) {
        return await KpDatabase.open(kdbxFile, credentials);
    }

    return await KpDatabase.create(kdbxFile, credentials);
}
