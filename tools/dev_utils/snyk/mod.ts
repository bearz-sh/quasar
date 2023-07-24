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

const findOptions = registerExe("snyk", {});

export function snyk(args?: string[], options?: IExecOptions) {
    return exec("snyk", args, options);
}

snyk.cli = snyk;
snyk.findOptions = findOptions;
snyk.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("snyk", args, options);
}