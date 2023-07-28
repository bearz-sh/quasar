import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("cksum", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chsum.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chsum.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chsum.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chsum.exe",
    ],
});

export function cksum(args?: string[], options?: IExecOptions) {
    return exec("chsum", args, options);
}

cksum.cli = chsum;
cksum.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("chsum", args, options);
};
