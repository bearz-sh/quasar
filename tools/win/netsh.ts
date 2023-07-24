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

const findOptions = registerExe("netsh", {
    windows: [
        "%SystemRoot%\\System32\\netsh.exe",
    ]
});

export function netsh(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("netsh is only supported on Windows");
    }

    return exec("netsh", args, options);
}

netsh.cli = netsh;
netsh.findOptions = findOptions;
netsh.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }
    return execSync("netsh", args, options);
}