import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export function node(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function nodeSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}
