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

const findOptions = registerExe("wt", {
    windows: [
        "%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe",
    ]
});

export function wt(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wt is only supported on Windows");
    }

    return exec("wt", args, options);
}

wt.cli = wt;
wt.findOptions = findOptions;
wt.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }
    return execSync("wt", args, options);
}