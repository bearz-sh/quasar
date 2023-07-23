import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("whoami", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\whoami.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\whoami.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\whoami.exe",
        "%SystemDrive%\\msys\\usr\\bin\\whoami.exe",
    ]
});

export function whoami(args?: string[], options?: IExecOptions) {
    return exec("whoami", args, options);
}

whoami.cli = whoami;
whoami.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("whoami", args, options);
}