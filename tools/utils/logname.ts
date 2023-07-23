import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("logname", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\logname.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\logname.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\logname.exe",
        "%SystemDrive%\\msys\\usr\\bin\\logname.exe",
    ]
});

export function logname(args?: string[], options?: IExecOptions) {
    return exec("logname", args, options);
}

logname.cli = logname;
logname.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("logname", args, options);
}