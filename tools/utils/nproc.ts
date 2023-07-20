import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("nproc", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\nproc.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\nproc.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\nproc.exe",
        "%SystemDrive%\\msys\\usr\\bin\\nproc.exe",
    ]
});

export function nproc(args?: string[], options?: IExecOptions) {
    return exec("nproc", args, options);
}

nproc.cli = nproc;
nproc.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("nproc", args, options);
}