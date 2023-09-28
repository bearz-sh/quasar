import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("nvs", {
    windows: [
        "%USERPROFILE%\\.nvs\\nvs.cmd",
    ],

    linux: [
        "${HOME}/.nvs/nvs",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("nvs", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("nvs", args, options);
}
