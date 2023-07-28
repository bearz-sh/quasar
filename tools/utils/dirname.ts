import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("dirname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\dirname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\dirname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\dirname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\dirname.exe",
    ],
});

export function dirname(args?: string[], options?: IExecOptions) {
    return exec("dirname", args, options);
}

dirname.cli = dirname;
dirname.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("dirname", args, options);
};
