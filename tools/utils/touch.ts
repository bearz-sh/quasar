import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("touch", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\touch.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\touch.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\touch.exe",
        "%SystemDrive%\\msys\\usr\\bin\\touch.exe",
    ]
});

export function touch(args?: string[], options?: IExecOptions) {
    return exec("touch", args, options);
}

touch.cli = touch;
touch.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("touch", args, options);
}