import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("install", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\install.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\install.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\install.exe",
        "%SystemDrive%\\msys\\usr\\bin\\install.exe",
    ]
});

export function install(args?: string[], options?: IExecOptions) {
    return exec("install", args, options);
}

export function installSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("install", args, options);
}