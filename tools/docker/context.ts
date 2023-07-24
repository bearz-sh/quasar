import { 
    IExecOptions, 
    IExecSyncOptions, 
    splat,
} from "../mod.ts";

import {
    DockerArgs,
    docker,
} from './base.ts'


export interface DockerContextCreateDockerArgs {
    from?: string;
    host?: string 
    ca?: string
    cert?: string
    key?: string
    skipTlsVerify?: boolean;
}

export interface DockerContextCreateArgs extends Omit<DockerArgs, 'context'> {
    context?: string;
    description?: string;
    docker?: DockerContextCreateDockerArgs;
    from?: string;
}

export interface DockerContextExportArgs extends DockerArgs {
    context: string;
    file?: string;
}

export interface DockerContextImportArgs extends DockerArgs {
    context: string;
    file: string;
}

export interface DockerContextInspectArgs extends Omit<DockerArgs, 'context'> {
    context: string[];
    format?: string;
}

export interface DockerContextLsArgs extends DockerArgs {
    format?: string;
    quiet?: boolean;
}

export interface DockerContextRmArgs extends Omit<DockerArgs, 'context'> {
    context: string[];
    force: boolean;
}

export interface DockerContextUpdateArgs extends DockerArgs {
    docker: DockerContextCreateDockerArgs;
    description?: string;
}

interface InnerDockerContextCreateArgs extends Omit<DockerContextCreateArgs, 'docker'> {
    docker?: string;
}

interface InnerDockerContextUpdateArgs extends Omit<DockerContextUpdateArgs, 'docker'> {
    docker: string;
}


function buildContextArgs(args: DockerContextCreateDockerArgs) {
    let str = "";
    if (args.from) {
        str += `from=${args.from}`;
    } else if(args.host) {
        str += `host=${args.host}`;
    }

    if (args.ca) {
        str += `,ca=${args.ca}`;
    }

    if (args.cert) {
        str += `,cert=${args.cert}`;
    }

    if (args.key) {
        str += `,key=${args.key}`;
    }

    if (args.skipTlsVerify) {
        str += `,skip-tls-verify`;
    }

    return str;
}

export function create(args: DockerContextCreateArgs, options?: IExecOptions) {

    if (args.docker) {
        const innerArgs : InnerDockerContextCreateArgs = {
            context: args.context,
            docker: buildContextArgs(args.docker),
            decription: args.description,
        }

        return docker(["context", "create", ...splat(innerArgs, {
            arguments: ["context"],
            appendArguments: true,
        })], options);
    }


    return docker(["context", "create", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function createSync(args: DockerContextCreateArgs, options?: IExecSyncOptions) {
    if (args.docker) {
        const innerArgs : InnerDockerContextCreateArgs = {
            context: args.context,
            docker: buildContextArgs(args.docker),
            decription: args.description,
        }

        return docker.sync(["context", "create", ...splat(innerArgs, {
            arguments: ["context"],
            appendArguments: true,
        })], options);
    }
}

export function _export(args: DockerContextExportArgs, options?: IExecOptions) {
    return docker(["context", "export", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function exportSync(args: DockerContextExportArgs, options?: IExecSyncOptions) {
    return docker.sync(["context", "export", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function _import(args: DockerContextImportArgs, options?: IExecOptions) {
    return docker(["context", "import", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function importSync(args: DockerContextImportArgs, options?: IExecSyncOptions) {
    return docker.sync(["context", "import", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function inspect(args: DockerContextInspectArgs, options?: IExecOptions) {
    return docker(["context", "inspect", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function inspectSync(args: DockerContextInspectArgs, options?: IExecSyncOptions) {
    return docker.sync(["context", "inspect", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function ls(args: DockerContextLsArgs, options?: IExecOptions) {
    return docker(["context", "ls", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function lsSync(args: DockerContextLsArgs, options?: IExecSyncOptions) {
    return docker.sync(["context", "ls", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function rm(args: DockerContextRmArgs, options?: IExecOptions) {
    return docker(["context", "rm", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function rmSync(args: DockerContextRmArgs, options?: IExecSyncOptions) {
    return docker.sync(["context", "rm", ...splat(args, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function update(args: DockerContextUpdateArgs, options?: IExecOptions) {
    const innerArgs : InnerDockerContextUpdateArgs = {
        context: args.context,
        docker: buildContextArgs(args.docker),
        description: args.description,
    }

    return docker(["context", "update", ...splat(innerArgs, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}

export function updateSync(args: DockerContextUpdateArgs, options?: IExecSyncOptions) {
    const innerArgs : InnerDockerContextUpdateArgs = {
        context: args.context,
        docker: buildContextArgs(args.docker),
        description: args.description,
    }

    return docker.sync(["context", "update", ...splat(innerArgs, {
        arguments: ["context"],
        appendArguments: true,
    })], options);
}