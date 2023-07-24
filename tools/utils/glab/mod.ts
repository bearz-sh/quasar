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

const findOptions = registerExe("glab", {});

export function glab(args?: string[], options?: IExecOptions) {
    return exec("glab", args, options);
}

glab.cli = glab;
glab.findOptions = findOptions;
glab.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("glab", args, options);
}