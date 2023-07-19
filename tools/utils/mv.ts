import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("mv", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\mv.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\mv.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\mv.exe",
        "%SystemDrive%\\msys\\usr\\bin\\mv.exe",
    ]
});

export function mv(args?: string[], options?: IExecOptions) {
    return exec("mv", args, options);
}

export function mvSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("mv", args, options);
}