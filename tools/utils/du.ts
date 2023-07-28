import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("du", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\du.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\du.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\du.exe",
        "%SystemDrive%\\msys\\usr\\bin\\du.exe",
    ],
});

export function du(args?: string[], options?: IExecOptions) {
    return exec("du", args, options);
}

du.cli = du;
du.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("du", args, options);
};
