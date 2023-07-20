import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("hostname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\hostname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\hostname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\hostname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\hostname.exe",
    ]
});

export function hostname(args?: string[], options?: IExecOptions) {
    return exec("hostname", args, options);
}

hostname.cli = hostname;
hostname.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("hostname", args, options);
}