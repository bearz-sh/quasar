import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("rm", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\rm.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\rm.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\rm.exe",
        "%SystemDrive%\\msys\\usr\\bin\\rm.exe",
    ]
});

export function rm(args?: string[], options?: IExecOptions) {
    return exec("rm", args, options);
}

rm.cli = rm;
rm.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("rm", args, options);
}