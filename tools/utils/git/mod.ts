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

const findOptions = registerExe("git", {});

export function git(args?: string[], options?: IExecOptions) {
    return exec("git", args, options);
}

git.cli = git;
git.findOptions = findOptions;
git.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("git", args, options);
};
