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
    PsOutput
} from "../../mod.ts";

const findOptions = registerExe("git", {});

export function git(args?: string[], options?: IExecOptions) {
    return exec("git", args, options);
}

git.cli = git;
git.findOptions = findOptions;
git.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("git", args, options);
}