import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("chown", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chown.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chown.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chown.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chown.exe",
    ]
});

export function chown(args?: string[], options?: IExecOptions) {
    return exec("chown", args, options);
}

export function chownSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("chown", args, options);
}