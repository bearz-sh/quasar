import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../mod.ts";

registerExe("kill", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\kill.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\kill.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\kill.exe",
        "%SystemDrive%\\msys\\usr\\bin\\kill.exe",
    ],
});

export function kill(args?: string[], options?: IExecOptions) {
    return exec("kill", args, options);
}

kill.cli = kill;
kill.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("kill", args, options);
};
