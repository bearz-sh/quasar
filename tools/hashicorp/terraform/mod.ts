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

const findOptions = registerExe("terraform", {});

export function terraform(args?: string[], options?: IExecOptions) {
    return exec("terraform", args, options);
}

terraform.cli = terraform;
terraform.findOptions = findOptions;
terraform.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("terraform", args, options);
}