import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("mkcert", {});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("mkcert", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("mkcert", args, options);
}
