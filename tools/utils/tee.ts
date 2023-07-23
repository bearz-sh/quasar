import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("tee", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\tee.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\tee.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\tee.exe",
        "%SystemDrive%\\msys\\usr\\bin\\tee.exe",
    ]
});

export function tee(args?: string[], options?: IExecOptions) {
    return exec("tee", args, options);
}

tee.cli = tee;
tee.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("tee", args, options);
}