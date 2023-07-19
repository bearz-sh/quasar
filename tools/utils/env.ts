import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("env", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\env.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\env.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\env.exe",
        "%SystemDrive%\\msys\\usr\\bin\\env.exe",
    ]
});

export function env(args?: string[], options?: IExecOptions) {
    return exec("env", args, options);
}

export function envSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("env", args, options);
}