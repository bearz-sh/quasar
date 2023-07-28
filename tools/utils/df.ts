import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("df", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\df.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\df.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\df.exe",
        "%SystemDrive%\\msys\\usr\\bin\\df.exe",
    ],
});

export function df(args?: string[], options?: IExecOptions) {
    return exec("df", args, options);
}

df.cli = df;
df.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("df", args, options);
};
