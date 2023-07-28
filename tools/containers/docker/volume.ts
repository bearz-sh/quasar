import { IExecOptions, IExecSyncOptions, splat } from "../../mod.ts";

import { docker, DockerArgs } from "./base.ts";

export interface DockerVolumeCreateArgs extends DockerArgs {
    volume: string;
    driver?: string;
    opt?: string[];
    label?: string[];
}

export interface DockerVolumeInspectArgs extends DockerArgs {
    volume: string[];
    format?: string;
}

export interface DockerVolumeLsArgs extends DockerArgs {
    filter?: string;
    format?: string;
    noTrunc?: boolean;
    quiet?: boolean;
}

export interface DockerVolumePruneArgs extends DockerArgs {
    all?: boolean;
    filter?: string;
    force?: boolean;
}

export interface DockerVolumeRmArgs extends DockerArgs {
    volume: string[];
    force?: boolean;
}

function volume(options: IExecOptions) {
    return docker(["volume"], options);
}

volume.sync = function (options: IExecSyncOptions) {
    return docker.sync(["volume"], options);
};

export function create(args: DockerVolumeCreateArgs, options?: IExecOptions) {
    return docker([
        "volume",
        "create",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function createSync(args: DockerVolumeCreateArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "volume",
        "create",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function inspect(args: DockerVolumeInspectArgs, options?: IExecOptions) {
    return docker([
        "volume",
        "inspect",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function inspectSync(args: DockerVolumeInspectArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "volume",
        "inspect",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function ls(args: DockerVolumeLsArgs, options?: IExecOptions) {
    return docker([
        "volume",
        "ls",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function lsSync(args: DockerVolumeLsArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "volume",
        "ls",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function prune(args: DockerVolumePruneArgs, options?: IExecOptions) {
    return docker([
        "volume",
        "prune",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function pruneSync(args: DockerVolumePruneArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "volume",
        "prune",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function rm(args: DockerVolumeRmArgs, options?: IExecOptions) {
    return docker([
        "volume",
        "rm",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}

export function rmSync(args: DockerVolumeRmArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "volume",
        "rm",
        ...splat(args, {
            arguments: ["volume"],
            appendArguments: true,
        }),
    ], options);
}
