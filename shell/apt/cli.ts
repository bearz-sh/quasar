import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("apt", {});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("apt", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("apt", args, options);
}
