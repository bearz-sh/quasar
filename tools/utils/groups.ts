import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("groups", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\groups.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\groups.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\groups.exe",
        "%SystemDrive%\\msys\\usr\\bin\\groups.exe",
    ]
});

export function groups(args?: string[], options?: IExecOptions) {
    return exec("groups", args, options);
}

groups.cli = groups;
groups.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("groups", args, options);
}