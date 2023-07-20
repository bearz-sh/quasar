import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("cut", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\cut.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\cut.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\cut.exe",
        "%SystemDrive%\\msys\\usr\\bin\\cut.exe",
    ]
});

export function cut(args?: string[], options?: IExecOptions) {
    return exec("cut", args, options);
}

cut.cli = cut;
cut.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("cut", args, options);
}