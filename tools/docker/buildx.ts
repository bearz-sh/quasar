import { 
    IExecOptions, 
    IExecSyncOptions, 
    splat,
} from "../mod.ts";

import {
    buildx,
} from './base.ts'

export interface DockerBuildxArgs extends Record<string, unknown> {
    builder?: string;
}

export interface DockerBuildxBakeArgs extends DockerBuildxArgs {
    target: string[],
    file?: string[]
    load?: boolean;
    metadataFile?: string;
    noCache?: boolean;
    print?: boolean
    progress?: 'auto' | 'plain' | 'tty';
    provenance?: string
    pull?: boolean;
    push?: boolean;
    sbom?: string;
    set?: string[];
}

export interface DockerBuildxBuildArgs extends DockerBuildxArgs {
    path?: string;
    addHost?: string[];
    allow?: string[];
    attest?: string[];
    buildArg?: string[];
    buildContext?: string;
    cacheFrom?: string[];
    cacheTo?: string[];
    cgroupParent?: string;
    file?: string[];
    iidfile?: string;
    label?: string[];
    load?: boolean;
    metadataFile?: string;
    network?: string;
    noCache?: boolean;
    noCacheFrom?: string[];
    output?: string[];
    platform?: string[];
    progress?: 'auto' | 'plain' | 'tty';
    provenance?: string;
    pull?: boolean;
    push?: boolean;
    quiet?: boolean;
    sbom?: string;
    secret?: string[];
    shmSize?: string;
    ssh?: string[];
    tag?: string[];
    target?: string;
    ulimit?: string[];
}

export interface DockerBuildxCreateArgs extends DockerBuildxArgs {
    ['_']: string[];
    append?: boolean;
    bootstrap?: boolean;
    bildkitFlags?: string;
    config?: string;
    driver?: string;
    driverOpts?: string[];
    leave?: boolean;
    name?: string;
    node?: string;
    platform?: string[];
    use?: boolean
}

export interface DockerBuildxDuArgs extends DockerBuildxArgs {
    filter?: string;
    verbose?: boolean;
}

export interface DockerBuildxInspectArgs extends DockerBuildxArgs {
    bootstrap?: boolean;
    name: string;
}

export interface DockerBuildxPruneArgs extends DockerBuildxArgs {
    all?: boolean;
    builder?: string 
    filter?: string;
    force?: boolean;
    keepStorage?: string;
    verbose?: boolean;
}



export interface DockerBuildxRmArgs extends DockerBuildxArgs {
    name: string;
    allInactive?: boolean;
    force?: boolean;
    keepDaemon?: boolean;
    keepState?: boolean;
}

export interface DockerBuildxStopArgs extends DockerBuildxArgs {
    name: string 
}

export interface DockerBuildxUseArgs extends DockerBuildxArgs {
    name: string 
    default?: boolean
    global?: boolean
}

export function bake(args: DockerBuildxBakeArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["target"],
        appendArguments: true
    }), options);
}

export function bakeSync(args: DockerBuildxBakeArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["target"],
        appendArguments: true
    }), options);
}

export function build(args: DockerBuildxBuildArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["path"],
        appendArguments: true
    }), options);
}

export function buildSync(args: DockerBuildxBuildArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["path"],
        appendArguments: true
    }), options);
}


export function create(args: DockerBuildxCreateArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["context"],
        appendArguments: true 
    }), options);
}

export function createSync(args: DockerBuildxCreateArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["context"],
        appendArguments: true
    }), options);
}

export function du(args: DockerBuildxDuArgs, options?: IExecOptions) {
    return buildx(splat(args), options);
}

export function duSync(args: DockerBuildxDuArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args), options);
}

export function inspect(args: DockerBuildxInspectArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["name"]
    }), options);
}

export function inspectSync(args: DockerBuildxInspectArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args), options);
}

export function ls(options?: IExecOptions) {
    return buildx([], options);
}

export function lsSync(options?: IExecSyncOptions) {
    return buildx.sync([], options);
}

export function prune(args: DockerBuildxPruneArgs, options?: IExecOptions) {
    return buildx(splat(args), options);
}

export function pruneSync(args: DockerBuildxPruneArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args), options);
}

export function rm(args: DockerBuildxRmArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["name"]
    }), options);
}

export function rmSync(args: DockerBuildxRmArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["name"]
    }), options);
}

export function stop(args: DockerBuildxStopArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["name"]
    }), options);
}

export function stopSync(args: DockerBuildxStopArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["name"]
    }), options);
}

export function use(args: DockerBuildxUseArgs, options?: IExecOptions) {
    return buildx(splat(args, {
        arguments: ["name"]
    }), options);
}

export function useSync(args: DockerBuildxUseArgs, options?: IExecSyncOptions) {
    return buildx.sync(splat(args, {
        arguments: ["name"],
        appendArguments: true
    }), options);
}



