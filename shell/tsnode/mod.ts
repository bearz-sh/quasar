import { NotFoundOnPathError } from "../../errors/mod.ts";
import { exec, execSync, IExecOptions, IExecSyncOptions } from "../core/mod.ts";
import { findNpmBinFile, findNpmBinFileSync } from "../npm/mod.ts";

// TODO: create a cli.ts file and register_script_runner.ts file for ts-node
export async function tsnode(args?: string[], options?: IExecOptions) {
    const cli = tsnode.path || await findNpmBinFile("ts-node");
    if (!cli) {
        throw new NotFoundOnPathError("ts-node");
    }
    return exec(cli, args, options);
}

export function tsnodeSync(args?: string[], options?: IExecSyncOptions) {
    const cli = tsnode.path || findNpmBinFileSync("ts-node");
    if (!cli) {
        throw new NotFoundOnPathError("ts-node");
    }
    return execSync(cli, args, options);
}

tsnode.path = null as string | null;
