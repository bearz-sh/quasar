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

const findOptions = registerExe("glab", {});

export function glab(args?: string[], options?: IExecOptions) {
    return exec("glab", args, options);
}

glab.cli = glab;
glab.findOptions = findOptions;
glab.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("glab", args, options);
};
