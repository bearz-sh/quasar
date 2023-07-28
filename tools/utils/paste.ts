import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("paste", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\paste.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\paste.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\paste.exe",
        "%SystemDrive%\\msys\\usr\\bin\\paste.exe",
    ],
});

export function paste(args?: string[], options?: IExecOptions) {
    return exec("paste", args, options);
}

paste.cli = paste;
paste.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("paste", args, options);
};
