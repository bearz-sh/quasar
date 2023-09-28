import { isDirectory, isDirectorySync } from "../../fs/mod.ts";
import { join } from "../../path/mod.ts";
import { cwd, which, whichSync } from "../../process/mod.ts";
import {
    exec,
    execSync,
    exists,
    existsSync,
    IExecOptions,
    IExecSyncOptions,
    IS_WINDOWS,
    registerExe,
} from "../core/mod.ts";

registerExe("npm", {
    windows: [
        "%ProgramFiles%\\nodejs\\npm.cmd",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("npm", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("npm", args, options);
}

export function findBinFileSync(exe: string, workingDirectory?: string): string | undefined {
    exe = IS_WINDOWS ? `${exe}.cmd` : exe;
    workingDirectory ||= cwd();

    const npmBin = join(workingDirectory, "node_modules", ".bin");

    if (isDirectorySync(npmBin)) {
        const file = join(npmBin, exe);
        if (existsSync(file)) {
            return file;
        }
    }

    return whichSync(exe);
}

export async function findBinFile(exe: string, workingDirectory?: string): Promise<string | undefined> {
    exe = IS_WINDOWS ? `${exe}.cmd` : exe;
    workingDirectory ||= cwd();

    const npmBin = join(workingDirectory, "node_modules", ".bin");

    if (await isDirectory(npmBin)) {
        const file = join(npmBin, exe);
        if (await exists(file)) {
            return file;
        }
    }

    return await which(exe);
}
