import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("uniq", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\uniq.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\uniq.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\uniq.exe",
        "%SystemDrive%\\msys\\usr\\bin\\uniq.exe",
    ]
});

export function uniq(args?: string[], options?: IExecOptions) {
    return exec("uniq", args, options);
}

uniq.cli = uniq;
uniq.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("uniq", args, options);
}