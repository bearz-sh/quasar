import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("base64", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\base64.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\base64.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\base64.exe",
        "%SystemDrive%\\msys\\usr\\bin\\base64.exe",
    ]
});

export function base64(args?: string[], options?: IExecOptions) {
    return exec("base64", args, options);
}

export function base64Sync(args?: string[], options?: IExecSyncOptions) {
    return execSync("base64", args, options);
}