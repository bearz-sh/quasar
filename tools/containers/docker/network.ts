import { IExecOptions, IExecSyncOptions, splat } from "../../mod.ts";

import { docker, DockerArgs } from "./base.ts";

export interface DockerNetworkConnectArgs extends DockerArgs {
    container: string;
    network: string;
    alias?: string[];
    driverOpts?: string[];
    ip: string;
    ip6: string;
    link?: string[];
    linkLocalIpV6?: string[];
}

export interface DockerNetworkCreateArgs extends DockerArgs {
    network: string;
    attachable?: boolean;
    auxAddress?: string[];
    configFrom?: string;
    configOnly?: boolean;
    driver?: string;
    gateway?: string[];
    ingress?: boolean;
    internal?: boolean;
    ipRange?: string[];
    ipamDriver?: string;
    ipamOpt?: string[];
    ipv6?: boolean;
    label?: string[];
    opt?: string[];
    scope?: string;
    subnet?: string[];
}

export interface DockerNetworkDisconnectArgs extends DockerArgs {
    container: string;
    network: string;
    force?: boolean;
}

export interface DockerNetworkInspectArgs extends DockerArgs {
    network: string[];
    format?: string;
    verbose?: boolean;
}

export interface DockerNetworkLsArgs extends DockerArgs {
    filter?: string;
    format?: string;
    noTrunc?: boolean;
    quiet?: boolean;
}

export interface DockerNetworkPruneArgs extends DockerArgs {
    force?: boolean;
    filter?: string;
}

export interface DockerNetworkRmArgs extends DockerArgs {
    network: string[];
    force?: boolean;
}

export function connect(args: DockerNetworkConnectArgs, options?: IExecOptions) {
    return docker([
        "network",
        "connect",
        ...splat(args, {
            arguments: ["container", "network"],
            appendArguments: true,
        }),
    ], options);
}

export function connectSync(args: DockerNetworkConnectArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "network",
        "connect",
        ...splat(args, {
            arguments: ["container", "network"],
            appendArguments: true,
        }),
    ], options);
}

export function create(args: DockerNetworkCreateArgs, options?: IExecOptions) {
    return docker([
        "network",
        "create",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}

export function createSync(args: DockerNetworkCreateArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "network",
        "create",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}

export function disconnect(args: DockerNetworkDisconnectArgs, options?: IExecOptions) {
    return docker([
        "network",
        "disconnect",
        ...splat(args, {
            arguments: ["container", "network"],
            appendArguments: true,
        }),
    ], options);
}

export function disconnectSync(args: DockerNetworkDisconnectArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "network",
        "disconnect",
        ...splat(args, {
            arguments: ["container", "network"],
            appendArguments: true,
        }),
    ], options);
}

export function inspect(args: DockerNetworkInspectArgs, options?: IExecOptions) {
    return docker([
        "network",
        "inspect",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}

export function inspectSync(args: DockerNetworkInspectArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "network",
        "inspect",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}

export function ls(args: DockerNetworkLsArgs, options?: IExecOptions) {
    return docker(["network", "ls", ...splat(args)], options);
}

export function lsSync(args: DockerNetworkLsArgs, options?: IExecSyncOptions) {
    return docker.sync(["network", "ls", ...splat(args)], options);
}

export function prune(args: DockerNetworkPruneArgs, options?: IExecOptions) {
    return docker(["network", "prune", ...splat(args)], options);
}

export function pruneSync(args: DockerNetworkPruneArgs, options?: IExecSyncOptions) {
    return docker.sync(["network", "prune", ...splat(args)], options);
}

export function rm(args: DockerNetworkRmArgs, options?: IExecOptions) {
    return docker([
        "network",
        "rm",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}

export function rmSync(args: DockerNetworkRmArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "network",
        "rm",
        ...splat(args, {
            arguments: ["network"],
            appendArguments: true,
        }),
    ], options);
}
