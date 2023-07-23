import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("mv", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\mv.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\mv.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\mv.exe",
        "%SystemDrive%\\msys\\usr\\bin\\mv.exe",
    ]
});

export function mv(args?: string[], options?: IExecOptions) {
    return exec("mv", args, options);
}

mv.cli = mv;
mv.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("mv", args, options);
}