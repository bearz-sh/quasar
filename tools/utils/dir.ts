import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("dir", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\dir.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\dir.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\dir.exe",
        "%SystemDrive%\\msys\\usr\\bin\\dir.exe",
    ]
});

export function dir(args?: string[], options?: IExecOptions) {
    return exec("dir", args, options);
}

dir.cli = dir;
dir.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("dir", args, options);
}