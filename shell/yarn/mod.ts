export { findNpmBinFile, findNpmBinFileSync } from "../npm/mod.ts";
import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export function yarn(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function yarnSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}
