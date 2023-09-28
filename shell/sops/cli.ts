import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("sops", {});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("sops", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("sops", args, options);
}
