import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("sort", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\sort.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sort.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sort.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sort.exe",
    ]
});

export function sort(args?: string[], options?: IExecOptions) {
    return exec("sort", args, options);
}

export function sortSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("sort", args, options);
}