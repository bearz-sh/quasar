import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("ls", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\ls.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\ls.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\ls.exe",
        "%SystemDrive%\\msys\\usr\\bin\\ls.exe",
    ]
});

export function ls(args?: string[], options?: IExecOptions) {
    return exec("ls", args, options);
}

ls.cli = ls;
ls.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("ls", args, options);
}

