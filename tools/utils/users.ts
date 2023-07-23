import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("users", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\users.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\users.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\users.exe",
        "%SystemDrive%\\msys\\usr\\bin\\users.exe",
    ]
});

export function users(args?: string[], options?: IExecOptions) {
    return exec("users", args, options);
}

users.cli = users;
users.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("users", args, options);
}