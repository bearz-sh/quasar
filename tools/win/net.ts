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

const findOptions = registerExe("net", {
    windows: [
        "%SystemRoot%\\System32\\Dism.exe",
    ],
});

export function net(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("net is only supported on Windows");
    }

    return exec("net", args, options);
}

net.cli = net;
net.findOptions = findOptions;
net.sync = function (args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("wmic is only supported on Windows");
    }
    return execSync("net", args, options);
};
