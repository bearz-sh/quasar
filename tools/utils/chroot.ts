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

export function chrootSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("chroot", args, options);
}