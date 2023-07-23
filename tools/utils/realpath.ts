import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("realpath", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\realpath.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\realpath.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\realpath.exe",
        "%SystemDrive%\\msys\\usr\\bin\\realpath.exe",
    ]
});

export function realpath(args?: string[], options?: IExecOptions) {
    return exec("realpath", args, options);
}

realpath.cli = realpath;
realpath.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("realpath", args, options);
}
