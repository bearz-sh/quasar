import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("link", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\link.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\link.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\link.exe",
        "%SystemDrive%\\msys\\usr\\bin\\link.exe",
    ]
});

export function link(args?: string[], options?: IExecOptions) {
    return exec("link", args, options);
}

link.cli = link;
link.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("link", args, options);
}