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

const findOptions = registerExe("vault", {});

export function vault(args?: string[], options?: IExecOptions) {
    return exec("vault", args, options);
}

vault.cli = vault;
vault.findOptions = findOptions;
vault.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("vault", args, options);
};
