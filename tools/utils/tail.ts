import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("tail", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\tail.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\tail.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\tail.exe",
        "%SystemDrive%\\msys\\usr\\bin\\tail.exe",
    ]
});

export function tail(args?: string[], options?: IExecOptions) {
    return exec("tail", args, options);
}

tail.cli = tail;
tail.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("tail", args, options);
}
