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
} from "../../mod.ts";

const findOptions = registerExe("jq", {
    windows: [
        "%SystemRoot%\\System32\\Dism.exe",
    ]
});

export function dism(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("dism is only supported on Windows");
    }

    return exec("dism", args, options);
}

dism.cli = dism;
dism.findOptions = findOptions;
dism.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }
    return execSync("dism", args, options);
}