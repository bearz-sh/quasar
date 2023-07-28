import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("env", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\env.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\env.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\env.exe",
        "%SystemDrive%\\msys\\usr\\bin\\env.exe",
    ],
});

export function env(args?: string[], options?: IExecOptions) {
    return exec("env", args, options);
}

env.cli = env;
env.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("env", args, options);
};
