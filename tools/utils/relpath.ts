import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("relpath", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\relpath.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\relpath.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\relpath.exe",
        "%SystemDrive%\\msys\\usr\\bin\\relpath.exe",
    ]
});

export function relpath(args?: string[], options?: IExecOptions) {
    return exec("relpath", args, options);
}

relpath.cli = relpath;
relpath.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("relpath", args, options);
}

export function relpathSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("relpath", args, options);
}