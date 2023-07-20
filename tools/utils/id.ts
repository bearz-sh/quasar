import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("id", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\id.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\id.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\id.exe",
        "%SystemDrive%\\msys\\usr\\bin\\id.exe",
    ]
});

export function id(args?: string[], options?: IExecOptions) {
    return exec("id", args, options);
}

id.cli = id;
id.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("id", args, options);
}