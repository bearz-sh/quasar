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

const findOptions = registerExe("az", {});

export function az(args?: string[], options?: IExecOptions) {
    return exec("az", args, options);
}

az.cli = az;
az.findOptions = findOptions;
az.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("az", args, options);
}