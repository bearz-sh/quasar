import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("chmod", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chmod.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chmod.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chmod.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chmod.exe",
    ]
});

export function chmod(args?: string[], options?: IExecOptions) {
    return exec("chmod", args, options);
}

chmod.cli = chmod;
chmod.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("chmod", args, options);
}
