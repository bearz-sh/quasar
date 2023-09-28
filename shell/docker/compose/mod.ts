import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions, splat } from "../../core/mod.ts";
import { IComposeArgs, IComposeDownArgs, IComposeUpArgs } from "./interfaces.ts";

export type { IComposeArgs, IComposeDownArgs, IComposeUpArgs };

export function compose(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function composeSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}

const map = ["envFile", "file", "profile", "ansi", "projectDirectory"];

function composeSpat<T extends IComposeArgs>(name: string, cmd: T) {
    let args: string[] = [];
    const next: Partial<T> = cmd;
    const preArgs: IComposeArgs = {};
    for (let i = 0; i < map.length; i++) {
        const p = map[i];
        if (Object.hasOwn(next, p)) {
            preArgs[p] = next[p];
            delete next[p];
        }
    }

    args = args.concat(splat(preArgs, {
        prefix: "--",
    }));
    args.push(name);
    args = args.concat(splat(next, {
        prefix: "--",
    }));

    return args;
}

export function up(cmd?: IComposeUpArgs, options?: IExecOptions) {
    const args = composeSpat("up", cmd || {});
    return compose(args, options);
}

export function upSync(cmd?: IComposeUpArgs, options?: IExecSyncOptions) {
    const args = composeSpat("up", cmd || {});
    return composeSync(args, options);
}

export function down(cmd?: IComposeDownArgs, options?: IExecOptions) {
    const args = composeSpat("down", cmd || {});
    return compose(args, options);
}

export function downSync(cmd?: IComposeDownArgs, options?: IExecSyncOptions) {
    const args = composeSpat("down", cmd || {});
    return composeSync(args, options);
}
