import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("arch", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\arch.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\arch.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\arch.exe",
        "%SystemDrive%\\msys\\usr\\bin\\arch.exe",
    ]
});

export function arch(args?: string[], options?: IExecOptions) {
    return exec("arch", args, options);
}

arch.cli = arch;
arch.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("arch", args, options);
}
