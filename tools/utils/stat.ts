import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("stat", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\stat.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\stat.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\stat.exe",
        "%SystemDrive%\\msys\\usr\\bin\\stat.exe",
    ],
});

export function stat(args?: string[], options?: IExecOptions) {
    return exec("stat", args, options);
}

stat.cli = stat;
stat.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("stat", args, options);
};
