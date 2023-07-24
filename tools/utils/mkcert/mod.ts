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

const findOptions = registerExe("mkcert", {});

export function mkcert(args?: string[], options?: IExecOptions) {
    return exec("mkcert", args, options);
}

mkcert.cli = mkcert;
mkcert.findOptions = findOptions;
mkcert.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("mkcert", args, options);
}