import { IExecOptions, IExecSyncOptions, splat } from "../../mod.ts";

import { docker, DockerArgs } from "./base.ts";

import { DockerBuildxBuildArgs } from "./buildx.ts";

export interface DockerImageHistoryArgs extends DockerArgs {
    image: string;
    format?: string;
    human?: boolean;
    noTrunc?: boolean;
    quiet?: boolean;
}

export interface DockerImageInspectArgs extends DockerArgs {
    image: string[];
    format?: string;
}

export interface DockerImageLsArgs extends DockerArgs {
    repository?: string;
    all?: boolean;
    digests?: boolean;
    filter?: string;
    format?: string;
    noTrunc?: boolean;
    quiet?: boolean;
}

export interface DockerImageLoadArgs extends DockerArgs {
    input?: string;
    quiet?: boolean;
}

export interface DockerImagePruneArgs extends DockerArgs {
    all?: boolean;
    filter?: string;
    force?: boolean;
}

export interface DockerImagePullArgs extends DockerArgs {
    name: string;
    allTags?: boolean;
    disableContentTrust?: boolean;
    platform?: string;
    quiet?: boolean;
}

export interface DockerImagePushArgs extends DockerArgs {
    name: string;
    allTags?: boolean;
    disableContentTrust?: boolean;
    quiet?: boolean;
}

export interface DockerImageRmArgs extends DockerArgs {
    image: string[];
    force?: boolean;
    noPrune?: boolean;
}

export interface DockerImageSaveArgs extends DockerArgs {
    image: string[];
    output?: string;
}

export interface DockerImageTagArgs extends DockerArgs {
    sourceImage: string;
    targetImage: string;
}

/*
function image(options: IExecOptions) {
    return docker(["image"], options);
}

image.sync = function(options: IExecSyncOptions) {
    return docker.sync(["image"], options);
}
*/

export function build(args: DockerBuildxBuildArgs, options?: IExecOptions) {
    args.path ??= ".";
    return docker(
        splat(args, {
            command: ["image", "build"],
            arguments: ["path"],
            appendArguments: true,
        }),
        options,
    );
}

export function buildSync(args: DockerBuildxBuildArgs, options?: IExecSyncOptions) {
    args.path ??= ".";
    return docker.sync([
        "image",
        "build",
        ...splat(args, {
            arguments: ["path"],
            appendArguments: true,
        }),
    ], options);
}

export function history(args: DockerImageHistoryArgs, options?: IExecOptions) {
    return docker([
        "image",
        "history",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function historySync(args: DockerImageHistoryArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "history",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function inspect(args: DockerImageInspectArgs, options?: IExecOptions) {
    return docker([
        "image",
        "inspect",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function ls(args: DockerImageLsArgs, options?: IExecOptions) {
    return docker([
        "image",
        "ls",
        ...splat(args, {
            arguments: ["repository"],
            appendArguments: true,
        }),
    ], options);
}

export function lsSync(args: DockerImageLsArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "ls",
        ...splat(args, {
            arguments: ["repository"],
            appendArguments: true,
        }),
    ], options);
}

export function load(args: DockerImageLoadArgs, options?: IExecOptions) {
    return docker(["image", "load", ...splat(args)], options);
}

export function loadSync(args: DockerImageLoadArgs, options?: IExecSyncOptions) {
    return docker.sync(["image", "load", ...splat(args)], options);
}

export function prune(args: DockerImagePruneArgs, options?: IExecOptions) {
    return docker(["image", "prune", ...splat(args)], options);
}

export function prunSync(args: DockerImagePruneArgs, options?: IExecSyncOptions) {
    return docker.sync(["image", "prune", ...splat(args)], options);
}

export function pull(args: DockerImagePullArgs, options?: IExecOptions) {
    return docker([
        "image",
        "pull",
        ...splat(args, {
            arguments: ["name"],
            appendArguments: true,
        }),
    ], options);
}

export function pullSync(args: DockerImagePullArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "pull",
        ...splat(args, {
            arguments: ["name"],
            appendArguments: true,
        }),
    ], options);
}

export function push(args: DockerImagePushArgs, options?: IExecOptions) {
    return docker([
        "image",
        "push",
        ...splat(args, {
            arguments: ["name"],
            appendArguments: true,
        }),
    ], options);
}

export function pushSync(args: DockerImagePushArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "push",
        ...splat(args, {
            arguments: ["name"],
            appendArguments: true,
        }),
    ], options);
}

export function rm(args: DockerImageRmArgs, options?: IExecOptions) {
    return docker([
        "image",
        "rm",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function rmSync(args: DockerImageRmArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "rm",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function save(args: DockerImageSaveArgs, options?: IExecOptions) {
    return docker([
        "image",
        "save",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function saveSync(args: DockerImageSaveArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "save",
        ...splat(args, {
            arguments: ["image"],
            appendArguments: true,
        }),
    ], options);
}

export function tag(args: DockerImageTagArgs, options?: IExecOptions) {
    return docker([
        "image",
        "tag",
        ...splat(args, {
            arguments: ["sourceImage", "targetImage"],
            appendArguments: true,
        }),
    ], options);
}

export function tagSync(args: DockerImageTagArgs, options?: IExecSyncOptions) {
    return docker.sync([
        "image",
        "tag",
        ...splat(args, {
            arguments: ["sourceImage", "targetImage"],
            appendArguments: true,
        }),
    ], options);
}
