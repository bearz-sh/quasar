import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("groups", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\groups.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\groups.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\groups.exe",
        "%SystemDrive%\\msys\\usr\\bin\\groups.exe",
    ],
});

export function groups(args?: string[], options?: IExecOptions) {
    return exec("groups", args, options);
}

groups.cli = groups;
groups.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("groups", args, options);
};
