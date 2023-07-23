import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("sleep", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\sleep.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sleep.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sleep.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sleep.exe",
    ]
});

export function sleep(args?: string[], options?: IExecOptions) {
    return exec("sleep", args, options);
}

sleep.cli = sleep;
sleep.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("sleep", args, options);
}
