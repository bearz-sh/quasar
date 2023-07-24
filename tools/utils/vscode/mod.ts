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

const findOptions = registerExe("code", {});

export function vscode(args?: string[], options?: IExecOptions) {
    return exec("code", args, options);
}

vscode.cli = vscode;
vscode.findOptions = findOptions;
vscode.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("code", args, options);
}