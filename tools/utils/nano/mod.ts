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

const findOptions = registerExe("nano", {});

export function nano(args?: string[], options?: IExecOptions) {
    return exec("nano", args, options);
}

nano.cli = nano;
nano.findOptions = findOptions;
nano.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("nano", args, options);
};
