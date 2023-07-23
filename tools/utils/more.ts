import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("more", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\more.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\more.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\more.exe",
        "%SystemDrive%\\msys\\usr\\bin\\more.exe",
    ]
});

export function more(args?: string[], options?: IExecOptions) {
    return exec("more", args, options);
}

more.cli = more;
more.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("more", args, options);
}