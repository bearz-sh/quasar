// deno-lint-ignore-file no-unused-vars
import {
    exec,
    execSync,
    IExecOptions,
    IExecSyncOptions,
    IPkgInfo,
    IPkgMgr,
    IS_WINDOWS,
    PlatformNotSupportedError,
    PsOutput,
    registerExe,
    upm,
} from "../mod.ts";

const findOptions = registerExe("wmic", {
    windows: [
        "%SystemRoot%\\System32\\wbem\\WMIC.exe",
    ],
});

export function wmic(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }

    return exec("wmic", args, options);
}

wmic.cli = wmic;
wmic.findOptions = findOptions;
wmic.sync = function (args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }

    return execSync("wmic", args, options);
};
