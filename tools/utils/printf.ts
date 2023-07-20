import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("printf", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\printf.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\printf.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\printf.exe",
        "%SystemDrive%\\msys\\usr\\bin\\printf.exe",
    ]
});

export function printf(args?: string[], options?: IExecOptions) {
    return exec("printf", args, options);
}

printf.cli = printf;
printf.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("printf", args, options);
}