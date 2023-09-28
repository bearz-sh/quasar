import { hostWriter } from "../../ci/mod.ts";
import { retry } from "../../deps.ts";
import { ensureDirectory, exists, readFile, writeFile } from "../../fs/fs.ts";
import { get } from "../../os/env.ts";
import { dirname, join } from "../../path/mod.ts";
import { secretGenerator } from "../../secrets/mod.ts";
import { KpDatabase, createCredentials, kdbx } from "../../stack/keepass/mod.ts";
import { paths } from "../_paths.ts";
import { ISecretStore } from "../interfaces.ts";
import { load } from "../config/mod.ts";


export async function getOrCreateKey() {
    const envKey = get("AFT_KEEPASS_KEY");

    if (envKey) {
        return new TextEncoder().encode(envKey);
    }
    const config = await load();
    const keyFile = get("AFT_KEEPASS_KEYFILE") ?? join(config.paths.data, "etc", "key.bin");
    const dir = dirname(keyFile);
    if (!await exists(dir)) {
        await ensureDirectory(dir);
    }

    if (await exists(keyFile)) {
        return await readFile(keyFile)
    }

    const key = secretGenerator.generateAsUint8Array(33);
    await writeFile(keyFile, key);
    hostWriter.warn(`Backup your new key file at ${keyFile}}`)
    return key;

}

export class KeePassSecretStore implements ISecretStore
{
    #db: KpDatabase;

    constructor(db: KpDatabase)
    {
        this.#db = db;
    }

    async get(path: string): Promise<string|undefined> {
        const entry = await this.#db.findEntry(path, true);
            if (!entry) {
                return "";
            }
            
            const v = entry.fields.get("Password");
            if (v instanceof kdbx.ProtectedValue)
                return v.getText();

            return v as string;
    }

    async set(path: string,value: string): Promise<void> {
        const entry = await this.#db.getEntry(path);
        entry.fields.set("Password", kdbx.ProtectedValue.fromString(value));

        await this.#db.save();
    }

    remove(name: string): Promise<void> {
        const entry = this.#db.findEntry(name, true);
        if (entry) {
            this.#db.db.remove(entry);
        }
        return this.#db.save();
    }

    list(): Promise<string[]> {
        const names: string[] = [];
        for(const entry of this.#db.db.getDefaultGroup().allEntries()) {
            const v = entry.fields.get("Password");
            if (typeof v === "string") {
                names.push(v);
                continue;
            }

            if (v instanceof kdbx.ProtectedValue) {
                names.push(v.getText());
                continue;
            }
        }

        return Promise.resolve(names);
    }
}

let secretStore : ISecretStore | undefined = undefined;

export async function getOrCreateDefaultStore() {
    if (secretStore)
        return secretStore;

    const config = await load();
    const dir = get("AFT_KEEPASS") || join(config.paths.data, "etc");
    if (!await exists(dir)) {
        await ensureDirectory(dir);
    }
    const kdbxFile = join(dir, "aft.kdbx");
    const secret = await getOrCreateKey();
    const credentials = createCredentials(secret);
    if (await exists(kdbxFile))
    {
        const existingDb = await KpDatabase.open(kdbxFile, credentials);
        secretStore = new KeePassSecretStore(existingDb);
    } else {
        const newDb = await KpDatabase.create(kdbxFile, credentials);
        secretStore = new KeePassSecretStore(newDb);
    }

    return secretStore;
}