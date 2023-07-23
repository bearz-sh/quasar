import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("mkdir", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\mkdir.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\mkdir.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\mkdir.exe",
        "%SystemDrive%\\msys\\usr\\bin\\mkdir.exe",
    ]
});

export function mkdir(args?: string[], options?: IExecOptions) {
    return exec("mkdir", args, options);
}

mkdir.cli = mkdir;
mkdir.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("mkdir", args, options);
}
