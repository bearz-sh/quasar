import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("git", {
    windows: [
        "%ProgramFiles%\\Git\\bin\\git.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("git", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("git", args, options);
}
