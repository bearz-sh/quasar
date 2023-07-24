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

const findOptions = registerExe("aws", {});

export function aws(args?: string[], options?: IExecOptions) {
    return exec("aws", args, options);
}

aws.cli = aws;
aws.findOptions = findOptions;
aws.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("aws", args, options);
}