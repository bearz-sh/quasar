import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("echo", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\echo.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\echo.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\echo.exe",
        "%SystemDrive%\\msys\\usr\\bin\\echo.exe",
    ]
});

export function echo(args?: string[], options?: IExecOptions) {
    return exec("echo", args, options);
}

export function echoSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("echo", args, options);
}