import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("yes", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\yes.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\yes.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\yes.exe",
        "%SystemDrive%\\msys\\usr\\bin\\yes.exe",
    ]
});

export function yes(args?: string[], options?: IExecOptions) {
    return exec("yes", args, options);
}

yes.cli = yes;
yes.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("yes", args, options);
}