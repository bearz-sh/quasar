import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("seq", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\seq.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\seq.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\seq.exe",
        "%SystemDrive%\\msys\\usr\\bin\\seq.exe",
    ]
});

export function seq(args?: string[], options?: IExecOptions) {
    return exec("seq", args, options);
}

seq.cli = seq;
seq.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("seq", args, options);
}