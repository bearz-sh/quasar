import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("hostname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\hostname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\hostname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\hostname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\hostname.exe",
    ],
});

export function hostname(args?: string[], options?: IExecOptions) {
    return exec("hostname", args, options);
}

hostname.cli = hostname;
hostname.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("hostname", args, options);
};
