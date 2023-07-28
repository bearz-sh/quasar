import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("install", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\install.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\install.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\install.exe",
        "%SystemDrive%\\msys\\usr\\bin\\install.exe",
    ],
});

export function install(args?: string[], options?: IExecOptions) {
    return exec("install", args, options);
}

install.cli = install;
install.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("install", args, options);
};
