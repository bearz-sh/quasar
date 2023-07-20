import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("chsum", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chsum.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chsum.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chsum.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chsum.exe",
    ]
});

export function chsum(args?: string[], options?: IExecOptions) {
    return exec("chsum", args, options);
}

chsum.cli = chsum;
chsum.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("chsum", args, options);
}