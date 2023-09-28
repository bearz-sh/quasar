import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("choco", {
    windows: [
        "%ChocolateyInstall%\\bin\\choco.exe",
        "%ALLUSERSPROFILE%\\chocolatey\\bin\\choco.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("choco", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("choco", args, options);
}
