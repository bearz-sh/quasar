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

const findOptions = registerExe("just", {});

export function just(args?: string[], options?: IExecOptions) {
    return exec("just", args, options);
}

just.cli = just;
just.findOptions = findOptions;
just.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("just", args, options);
}