import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("join", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\join.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\join.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\join.exe",
        "%SystemDrive%\\msys\\usr\\bin\\join.exe",
    ]
});

export function join(args?: string[], options?: IExecOptions) {
    return exec("join", args, options);
}

join.cli = id;
join.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("join", args, options);
}