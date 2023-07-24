import { 
    IExecOptions, 
    IExecSyncOptions, 
    splat,
} from "../mod.ts";

import {
    DockerArgs,
    docker,
} from './base.ts'

export interface DockerSystemEventsArgs extends DockerArgs {
    filter?: string[];
    format?: string;
    since?: string;
    until?: string;
}

export interface DockerSystemDfArgs extends DockerArgs {
    format?: string;
    verbose?: boolean;
}

export interface DockerSystemPruneArgs extends DockerArgs {
    all?: boolean;
    filter?: string;
    force?: boolean;
    volumes?: boolean;
}


export interface DockerSystemInfoArgs extends DockerArgs {
    format?: string;
}

export function events(args: DockerSystemEventsArgs, options?: IExecOptions) {
    return docker(["events", ...splat(args)], options);
}

export function eventsSync(args: DockerSystemEventsArgs, options?: IExecSyncOptions) {
    return docker.sync(["events", ...splat(args)], options);
}

export function df(args: DockerSystemDfArgs, options?: IExecOptions) {
    return docker(["system", "df", ...splat(args)], options);
}

export function dfSync(args: DockerSystemDfArgs, options?: IExecSyncOptions) {
    return docker.sync(["system", "df", ...splat(args)], options);
}

export function prune(args: DockerSystemPruneArgs, options?: IExecOptions) {
    return docker(["system", "prune", ...splat(args)], options);
}

export function pruneSync(args: DockerSystemPruneArgs, options?: IExecSyncOptions) {
    return docker.sync(["system", "prune", ...splat(args)], options);
}

export function info(args: DockerSystemInfoArgs, options?: IExecOptions) {
    return docker(["system", "info", ...splat(args)], options);
}

export function infoSync(args: DockerSystemInfoArgs, options?: IExecSyncOptions) {
    return docker.sync(["system", "info", ...splat(args)], options);
}



