import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("false", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\false.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\false.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\false.exe",
        "%SystemDrive%\\msys\\usr\\bin\\false.exe",
    ],
});

export function _false(args?: string[], options?: IExecOptions) {
    return exec("false", args, options);
}

_false.cli = _false;
_false.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("false", args, options);
};
