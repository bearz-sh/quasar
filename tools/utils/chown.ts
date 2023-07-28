import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("chown", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chown.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chown.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chown.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chown.exe",
    ],
});

export function chown(args?: string[], options?: IExecOptions) {
    return exec("chown", args, options);
}

chown.cli = chown;
chown.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("chown", args, options);
};
