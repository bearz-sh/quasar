import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("mktemp", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\mktemp.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\mktemp.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\mktemp.exe",
        "%SystemDrive%\\msys\\usr\\bin\\mktemp.exe",
    ]
});

export function mktemp(args?: string[], options?: IExecOptions) {
    return exec("mktemp", args, options);
}

export function mktempSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("mktemp", args, options);
}