import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("true", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\true.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\true.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\true.exe",
        "%SystemDrive%\\msys\\usr\\bin\\true.exe",
    ]
});

export function _true(args?: string[], options?: IExecOptions) {
    return exec("true", args, options);
}

_true.cli = _true;
_true.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("true", args, options);
}