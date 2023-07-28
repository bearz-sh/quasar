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

const findOptions = registerExe("mkcert", {});

export function mkcert(args?: string[], options?: IExecOptions) {
    return exec("mkcert", args, options);
}

mkcert.cli = mkcert;
mkcert.findOptions = findOptions;
mkcert.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("mkcert", args, options);
};
