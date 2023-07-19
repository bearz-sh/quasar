import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("du", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\du.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\du.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\du.exe",
        "%SystemDrive%\\msys\\usr\\bin\\du.exe",
    ]
});

export function du(args?: string[], options?: IExecOptions) {
    return exec("du", args, options);
}

export function duSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("du", args, options);
}