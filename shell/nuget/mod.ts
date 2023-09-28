import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export function nuget(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function nugetSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}
