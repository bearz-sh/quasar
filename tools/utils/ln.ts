import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("ln", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\ln.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\ln.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\ln.exe",
        "%SystemDrive%\\msys\\usr\\bin\\ln.exe",
    ]
});

export function ln(args?: string[], options?: IExecOptions) {
    return exec("ln", args, options);
}

ln.cli = ln;
ln.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("ln", args, options);
}