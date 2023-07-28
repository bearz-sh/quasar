// deno-lint-ignore-file no-unused-vars
import {
    exec,
    execSync,
    IExecOptions,
    IExecSyncOptions,
    IPkgInfo,
    IPkgMgr,
    PsOutput,
    registerExe,
    upm,
} from "../../mod.ts";

const findOptions = registerExe("code", {});

export function vscode(args?: string[], options?: IExecOptions) {
    return exec("code", args, options);
}

vscode.cli = vscode;
vscode.findOptions = findOptions;
vscode.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("code", args, options);
};
