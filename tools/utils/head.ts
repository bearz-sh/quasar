import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("head", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\head.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\head.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\head.exe",
        "%SystemDrive%\\msys\\usr\\bin\\head.exe",
    ]
});

export function head(args?: string[], options?: IExecOptions) {
    return exec("head", args, options);
}

head.cli = head;
head.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("head", args, options);
}