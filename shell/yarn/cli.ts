import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("yarn", {
    windows: [
        "%ProgramFiles(x86)%\\Yarn\\bin\\yarn.cmd",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("yarn", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("yarn", args, options);
}
