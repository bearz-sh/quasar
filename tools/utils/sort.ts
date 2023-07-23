import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("sort", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\sort.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sort.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sort.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sort.exe",
    ]
});

export function sort(args?: string[], options?: IExecOptions) {
    return exec("sort", args, options);
}

sort.cli = sort;
sort.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("sort", args, options);
}