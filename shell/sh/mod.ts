import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export function sh(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function shSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}
