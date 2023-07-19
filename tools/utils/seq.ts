import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("seq", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\seq.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\seq.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\seq.exe",
        "%SystemDrive%\\msys\\usr\\bin\\seq.exe",
    ]
});

export function seq(args?: string[], options?: IExecOptions) {
    return exec("seq", args, options);
}

export function seqSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("seq", args, options);
}