import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("rmdir", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\rmdir.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\rmdir.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\rmdir.exe",
        "%SystemDrive%\\msys\\usr\\bin\\rmdir.exe",
    ]
});

export function rmdir(args?: string[], options?: IExecOptions) {
    return exec("rmdir", args, options);
}

export function rmdirSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("rmdir", args, options);
}