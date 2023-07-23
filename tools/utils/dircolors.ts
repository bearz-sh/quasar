import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("dircolors", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\dircolors.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\dircolors.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\dircolors.exe",
        "%SystemDrive%\\msys\\usr\\bin\\dircolors.exe",
    ]
});

export function dircolors(args?: string[], options?: IExecOptions) {
    return exec("dircolors", args, options);
}

dircolors.cli = dircolors;
dircolors.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("dircolors", args, options);
}