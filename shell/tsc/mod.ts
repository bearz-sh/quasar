import { NotFoundOnPathError } from "../../errors/mod.ts";
import { exec, execSync, IExecOptions, IExecSyncOptions } from "../core/mod.ts";
import { findNpmBinFile, findNpmBinFileSync } from "../npm/mod.ts";

export async function tsc(args?: string[], options?: IExecOptions) {
    const cli = tsc.path || await findNpmBinFile("tsc");
    if (!cli) {
        throw new NotFoundOnPathError("tsc");
    }
    return exec(cli, args, options);
}

export function tscSync(args?: string[], options?: IExecSyncOptions) {
    const cli = tsc.path || findNpmBinFileSync("tsc");
    if (!cli) {
        throw new NotFoundOnPathError("tsc");
    }
    return execSync(cli, args, options);
}

tsc.path = null as string | null;
