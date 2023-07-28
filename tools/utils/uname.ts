import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("uname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\uname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\uname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\uname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\uname.exe",
    ],
});

export function uname(args?: string[], options?: IExecOptions) {
    return exec("uname", args, options);
}

uname.cli = uname;
uname.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("uname", args, options);
};
