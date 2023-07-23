import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("who", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\who.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\who.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\who.exe",
        "%SystemDrive%\\msys\\usr\\bin\\who.exe",
    ]
});

export function who(args?: string[], options?: IExecOptions) {
    return exec("who", args, options);
}

who.cli = who;
who.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("who", args, options);
}