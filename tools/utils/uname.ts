import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("uname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\uname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\uname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\uname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\uname.exe",
    ]
});

export function uname(args?: string[], options?: IExecOptions) {
    return exec("uname", args, options);
}

export function unameSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("uname", args, options);
}