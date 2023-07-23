import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

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

echo.cli = echo;
echo.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("echo", args, options);
}