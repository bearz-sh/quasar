// deno-lint-ignore-file no-unused-vars
import {
    exec,
    execSync,
    IExecOptions,
    IExecSyncOptions,
    IPkgInfo,
    IPkgMgr,
    PsOutput,
    registerExe,
    upm,
} from "../../mod.ts";

const findOptions = registerExe("consul", {});

export function consul(args?: string[], options?: IExecOptions) {
    return exec("consul", args, options);
}

consul.cli = consul;
consul.findOptions = findOptions;
consul.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("consul", args, options);
};
