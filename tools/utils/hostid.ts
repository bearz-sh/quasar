import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("hostid", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\hostid.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\hostid.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\hostid.exe",
        "%SystemDrive%\\msys\\usr\\bin\\hostid.exe",
    ],
});

export function hostid(args?: string[], options?: IExecOptions) {
    return exec("hostid", args, options);
}

hostid.cli = hostid;
hostid.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("hostid", args, options);
};
