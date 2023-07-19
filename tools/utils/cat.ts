import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("cat", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\cat.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\cat.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\cat.exe",
        "%SystemDrive%\\msys\\usr\\bin\\cat.exe",
    ]
});

export function cat(args?: string[], options?: IExecOptions) {
    return exec("cat", args, options);
}

export function catSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("cat", args, options);
}