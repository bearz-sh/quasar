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

const findOptions = registerExe("sops", {});

export function sops(args?: string[], options?: IExecOptions) {
    return exec("sops", args, options);
}

sops.cli = sops;
sops.findOptions = findOptions;
sops.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("sops", args, options);
}