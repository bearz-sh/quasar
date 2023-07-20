import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("chroot", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\chroot.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\chroot.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\chroot.exe",
        "%SystemDrive%\\msys\\usr\\bin\\chroot.exe",
    ]
});

export function chroot(args?: string[], options?: IExecOptions) {
    return exec("chroot", args, options);
}

chroot.cli = chroot;
chroot.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("chroot", args, options);
}