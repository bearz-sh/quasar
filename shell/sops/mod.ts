import { cli, cliSync } from "./cli.ts";
import { exec, exists, existsSync, IExecOptions, IExecSyncOptions } from "../core/mod.ts";
import { homeDir, IS_DARWIN, NEW_LINE } from "../../os/mod.ts";
import { homeConfigDir } from "../../path/os.ts";
import { dirname, join } from "../../path/mod.ts";
import { writeTextFile, ensureDirectory, readTextFile } from "../../fs/fs.ts";

export function sops(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function sopsSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}

export async function createAgeKey(keyFile?: string) {
    keyFile ??= defaultAgeKeyFile();
    const dir = dirname(keyFile);
    const pubKeyFile = join(dir, "publicKey.txt");
    if (!await exists(keyFile)) {
        await ensureDirectory(dir);
        const o = await exec("age-keygen", ["-o", keyFile], { stdout: "piped", stderr: "piped" })
            .then((o) => o.throwOrContinue());

        let pubKeyLine = "";
        const contents = (await readTextFile(keyFile)).split('\n');
       pubKeyLine = contents[1];
        const pubKey = pubKeyLine.substring(pubKeyLine.indexOf(":") + 1).trim();
        await writeTextFile(pubKeyFile, pubKey);
        return { keyFile, pubKeyFile };
    }

    return { keyFile, pubKeyFile };
}

/**
 * Gets the default age key file path for sops.
 * @throws EnvVaribleNotSetError if the HOME environment variable is not set.
 * @returns the default age key file path for sops
 */
export function defaultAgeKeyFile() {
    return IS_DARWIN
        ? join(homeDir(), "Library", "Application Support", "sops", "age", "keys.txt")
        : join(homeConfigDir(), "sops", "age", "keys.txt");
}

export async function hasDefaultAgeKey() {
    const keyFile = defaultAgeKeyFile();
    return await exists(keyFile);
}

export function hasDefaultAgeKeySync() {
    const keyFile = defaultAgeKeyFile();
    return existsSync(keyFile);
}
