import { cli, cliSync, findBinFile, findBinFileSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export const findNpmBinFile = findBinFile;
export const findNpmBinFileSync = findBinFileSync;

export function npm(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function npmSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}
