import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("cp", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\cp.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\cp.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\cp.exe",
        "%SystemDrive%\\msys\\usr\\bin\\cp.exe",
    ],
});

export function cp(args?: string[], options?: IExecOptions) {
    return exec("cp", args, options);
}

cp.cli = cp;
cp.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("cp", args, options);
};
