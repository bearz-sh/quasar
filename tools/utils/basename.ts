import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("basename", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\basename.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\basename.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\basename.exe",
        "%SystemDrive%\\msys\\usr\\bin\\basename.exe",
    ]
});

export function basename(args?: string[], options?: IExecOptions) {
    return exec("basename", args, options);
}

export function basenameSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("basename", args, options);
}