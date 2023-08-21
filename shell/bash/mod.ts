import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts"

export function bash(args: string[], options?: IExecOptions) {
    return cli(args, options)
}

export function bashSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}