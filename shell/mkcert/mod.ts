import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";

export function mkcert(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function mkcertSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}

interface IMkCertGenerateOptions {
    domains: string[];
    certPath?: string;
    keyPath?: string;
}

export function generate(cmd: IMkCertGenerateOptions, options?: IExecOptions) {
    const splat: string[] = [];
    if (cmd.certPath) {
        splat.push("-cert-file", cmd.certPath);
    }

    if (cmd.keyPath) {
        splat.push("-key-file", cmd.keyPath);
    }

    splat.push(...cmd.domains);

    return mkcert(splat, options);
}

export function generateSync(cmd: IMkCertGenerateOptions, options?: IExecSyncOptions) {
    const splat: string[] = [];
    if (cmd.certPath) {
        splat.push("-cert-file", cmd.certPath);
    }

    if (cmd.keyPath) {
        splat.push("-key-file", cmd.keyPath);
    }

    splat.push(...cmd.domains);

    return mkcertSync(splat, options);
}

export async function caRootDir() {
    const o = await mkcert(["-CAROOT"], {
        stdout: "piped",
        stderr: "piped",
    });
    if (o.code !== 0) {
        return "";
    }

    const path = o.stdoutAsLines[0].trim();
    return path;
}

export function caRootDirSync() {
    const o = mkcertSync(["-CAROOT"], {
        stdout: "piped",
        stderr: "piped",
    });
    if (o.code !== 0) {
        return "";
    }

    const path = o.stdoutAsLines[0].trim();
    return path;
}
