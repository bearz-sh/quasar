import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("hashsum", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\hashsum.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\hashsum.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\hashsum.exe",
        "%SystemDrive%\\msys\\usr\\bin\\hashsum.exe",
    ]
});

export function hashsum(args?: string[], options?: IExecOptions) {
    return exec("hashsum", args, options);
}

hashsum.cli = hashsum;
hashsum.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("hashsum", args, options);
}