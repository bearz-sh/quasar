import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("hostid", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\hostid.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\hostid.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\hostid.exe",
        "%SystemDrive%\\msys\\usr\\bin\\hostid.exe",
    ]
});

export function hostid(args?: string[], options?: IExecOptions) {
    return exec("hostid", args, options);
}

hostid.cli = hostid;
hostid.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("hostid", args, options);
}