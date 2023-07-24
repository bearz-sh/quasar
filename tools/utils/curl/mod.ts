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

const findOptions = registerExe("curl", {});

export function curl(args?: string[], options?: IExecOptions) {
    return exec("curl", args, options);
}

curl.cli = curl;
curl.findOptions = findOptions;
curl.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("curl", args, options);
}