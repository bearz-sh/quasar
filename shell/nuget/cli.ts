import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("nuget", {
    windows: [
        "%ChocolateyInstall%\\bin\\nuget.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("nuget", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("nuget", args, options);
}
