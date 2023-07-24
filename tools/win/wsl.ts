// deno-lint-ignore-file no-unused-vars
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe,
    upm,
    IPkgInfo,
    IPkgMgr,
    PsOutput,
IS_WINDOWS,
PlatformNotSupportedError
} from "../mod.ts";

const findOptions = registerExe("wsl", {
    windows: [
        "%SystemRoot%\\System32\\wsl.exe",
    ]
});

export function wsl(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wsl is only supported on Windows");
    }

    return exec("wsl", args, options);
}

wsl.cli = wsl;
wsl.findOptions = findOptions;
wsl.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wsl is only supported on Windows");
    }
    return execSync("wsl", args, options);
}