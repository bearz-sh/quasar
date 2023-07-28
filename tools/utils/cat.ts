import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("cat", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\cat.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\cat.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\cat.exe",
        "%SystemDrive%\\msys\\usr\\bin\\cat.exe",
    ],
});

export function cat(args?: string[], options?: IExecOptions) {
    return exec("cat", args, options);
}

cat.cli = cat;
cat.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("cat", args, options);
};
