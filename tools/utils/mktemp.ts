import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

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

mktemp.cli = mktemp;
mktemp.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("mktemp", args, options);
}