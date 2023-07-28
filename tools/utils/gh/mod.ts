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

const findOptions = registerExe("gh", {});

export function gh(args?: string[], options?: IExecOptions) {
    return exec("gh", args, options);
}

gh.cli = gh;
gh.findOptions = findOptions;
gh.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("gh", args, options);
};
