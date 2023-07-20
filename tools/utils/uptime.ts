import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("uptime", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\uptime.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\uptime.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\uptime.exe",
        "%SystemDrive%\\msys\\usr\\bin\\uptime.exe",
    ]
});

export function uptime(args?: string[], options?: IExecOptions) {
    return exec("uptime", args, options);
}

uptime.cli = uptime;
uptime.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("uptime", args, options);
}