import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("stat", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\stat.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\stat.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\stat.exe",
        "%SystemDrive%\\msys\\usr\\bin\\stat.exe",
    ]
});

export function stat(args?: string[], options?: IExecOptions) {
    return exec("stat", args, options);
}

export function statSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("stat", args, options);
}