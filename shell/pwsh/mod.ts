import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export interface PwshArgs extends Record<string, unknown> {
    nonInteractive?: boolean;
    noLogo?: boolean;
    noProfile?: boolean;
    executionPolicy?: "Bypass" | "Restricted" | "RemoteSigned" | "Unrestricted" | "AllSigned";
    command?: string;
    file?: string;
    inputFormat?: "Text" | "XML";
    encodedCommand?: string;
    windowStyle?: "Normal" | "Minimal" | "Maximized" | "Hidden";
}

function converToParams(args: PwshArgs) {
    const params: string[] = [];
    for (const key in Object.keys(args)) {
        const v = args[key];
        const name = key[0].toUpperCase() + key.substring(1);
        if (typeof v === "boolean") {
            if (!v) {
                continue;
            }

            params.push(`-${name}`);
            continue;
        }

        params.push(name, String(v));
    }

    return params;
}

export function pwsh(args: PwshArgs | string[], options?: IExecOptions) {
    if (Array.isArray(args)) {
        return cli(args, options);
    }

    const params = converToParams(args);
    return cli(params, options);
}

export function pwshSync(args: PwshArgs | string[], options?: IExecSyncOptions) {
    if (Array.isArray(args)) {
        return cliSync(args, options);
    }

    const params = converToParams(args);
    return cliSync(params, options);
}
