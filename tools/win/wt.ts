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

const findOptions = registerExe("wt", {
    windows: [
        "%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe",
    ],
});

export function wt(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wt is only supported on Windows");
    }

    return exec("wt", args, options);
}

wt.cli = wt;
wt.findOptions = findOptions;
wt.sync = function (args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }
    return execSync("wt", args, options);
};
