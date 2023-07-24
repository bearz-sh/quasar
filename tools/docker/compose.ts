import { 
    IExecOptions, 
    IExecSyncOptions, 
    splat,
} from "../mod.ts";

import {
    compose,
} from './base.ts'


export interface DockerComposeArgs {
    ansi?: "never" | "always" | "auto"
    compatibility?: boolean
    file?: string[],
    parallel?: number
    projectDirectory?: string
    envFile?: string[]
    profile?: string[]
    progress?: "auto" | "plain" | "tty" | "quiet"
    projectName?: string
}

export interface DockerComposeBuildArgs extends DockerComposeArgs {
    service?: string[],
    buildArg?: string[]
    dryRun?: boolean
    memory?: string
    noCache?: boolean
    pull?: boolean
    push?: boolean
    quiet?: boolean
    ssh?: string
}

export interface DockerComposeConfigArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    format?: 'json' | 'yaml'
    hash?: string
    images?: boolean
    noConsistency?: boolean
    noInterpolate?: boolean
    noNormalize?: boolean
    noPathResolution?: boolean
    output?: string 
    profiles?: boolean
    quiet?: boolean
    resolveImageDigests?: boolean
    services?: boolean
    volumes?: boolean
}

export interface DockerComposeCpArgs extends DockerComposeArgs {
    src?: string 
    dest?: string
    archive?: boolean
    dryRun?: boolean
    followLink?: boolean
    index?: number
}

export interface DockerComposeCreateArgs extends DockerComposeArgs {
    service?: string[],
    build?: boolean
    dryRun?: boolean
    forceRecreate?: boolean
    noBuild?: boolean
    noRecreate?: boolean
    pull?: 'always' | 'missing' | 'never'
    removeOrphans?: boolean
    scales?: string
}

export interface DockerComposeDownArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    removeOrphans?: boolean
    rmi?: "all" | "local"
    timeout?: number
    volumes?: boolean
}

export interface DockerComposeEventsArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    json?: boolean
}

export interface DockerComposeExecArgs extends DockerComposeArgs {
    service: string,
    command: string
    args?: string[]
    detach?: boolean
    dryRun?: boolean
    env?: string[]
    index?: number
    noTTY?: boolean
    privileged?: boolean
    user?: string
    workdir?: string
}

export interface DockerComposeImagesArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    removeOrphans?: boolean
    signal?: string
}

export interface DockerComposeKillArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    format?: 'table' | 'json'
    quiet?: boolean
}

export interface DockerComposeLogsArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    follow?: boolean
    noColor?: boolean
    noLogPrefix?: boolean
    since?: string
    tail?: string
    timestamps?: boolean
    until?: string
}

export interface DockerComposeLsArgs extends DockerComposeArgs {
    service?: string[],
    all?: boolean
    dryRun?: boolean
    filter?: string
    format?: 'table' | 'json'
    quiet?: boolean
}

export interface DockerComposePauseArgs extends DockerComposeArgs {
    dryRun?: boolean
}

export interface DockerComposePortArgs extends DockerComposeArgs {
    service?: string
    privatePort?: string
    dryRun?: boolean
    index?: number
    protocol?: 'tcp' | 'udp'
}

export interface DockerComposePsArgs extends DockerComposeArgs {
    service?: string[],
    all?: boolean
    dryRun?: boolean
    filter?: string
    format?: 'table' | 'json'
    quiet?: boolean
    services?: boolean
    status?: Array<'created' | 'restarting' | 'running' | 'removing' | 'paused' | 'exited' | 'dead'>
}

export interface DockerComposePullArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    ignoreBuildable?: boolean
    ignorePullFailures?: boolean
    includeDeps?: boolean
    quiet?: boolean
}

export interface DockerComposePushArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    ignorePushFailures?: boolean
    includeDeps?: boolean
    quiet?: boolean
}

export interface DockerComposeRestartArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    noDeps?: boolean
    timeout?: number
}

export interface DockerComposeRmArgs extends DockerComposeArgs {
    service?: string[],
    dryRun?: boolean
    force?: boolean
    stop?: boolean
    volumes?: boolean
}

export interface DockerComposeRunArgs extends DockerComposeArgs {
    service: string,
    command: string
    args?: string[]
    build?: boolean
    capAdd?: string[]
    capDrop?: string[]
    detach?: boolean
    dryRun?: boolean
    entrypoint?: string
    env?: string[]
    interactive?: boolean
    label?: string[]
    name?: string
    noTTY?: boolean
    noDeps?: boolean
    publish?: string[]
    quietPull?: boolean
    removeOrphans?: boolean
    rm?: boolean
    servicePorts?: boolean
    useAliases?: boolean
    user?: string
    volume?: string[]
    workdir?: string
}

export interface DockerComposeStartArgs extends DockerComposeArgs {
    service: string[],
    dryRun?: boolean
}

export interface DockerComposeStopArgs extends DockerComposeArgs {
    service: string[],
    dryRun?: boolean
}

export interface DockerComposeTopArgs extends DockerComposeArgs {
    service: string[],
    dryRun?: boolean
}

export interface DockerComposeUnpauseArgs extends DockerComposeArgs {
    service: string[],
    dryRun?: boolean
}

export interface DockerComposeUpArgs extends DockerComposeArgs {
    service?: string[],
    abortOnContainerExit?: boolean
    alwaysRecreateDeps?: boolean
    attach?: string[]
    attachDependencies?: boolean
    build?: boolean
    detach?: boolean
    dryRun?: boolean
    exitCodeFrom?: string
    forceRecreate?: boolean
    noAttach?: string[]
    noBuild?: boolean
    noColor?: boolean
    noDeps?: boolean
    noRecreate?: boolean
    noStart?: boolean
    pull?: 'always' | 'missing' | 'never'
    quietPull?: boolean
    removeOrphans?: boolean
    renewAnonVolumes?: boolean
    scale?: string[]
    timeout?: number
    timestamps?: boolean
    wait?: boolean
    waitTimeout?: number
}

export interface DockerComposeVersionArgs extends DockerComposeArgs {
    dryRun?: boolean
    format?: 'pretty' | 'json'
    short?: boolean
}

function splatComposeArgs(command: string, args: DockerComposeArgs, argumentNames?: string[]) {
    argumentNames = argumentNames || ["service"];
    const splatArgs = splat(args as unknown as Record<string, unknown>, {
        includes: ["ansi", "compatibility", "parallel", "projectDirectory", "profile", "progress", "projectName"],
    });
    const commandArgs = splat(args as unknown as Record<string, unknown>, { 
        command: [command],
        excludes: ["ansi", "compatibility", "parallel", "projectDirectory", "profile", "progress", "projectName"],
        arguments: argumentNames,
        appendArguments: true,
    });

    return splatArgs.concat(commandArgs)
}

export function build(args: DockerComposeBuildArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("build", args), options);
}

export function buildSync(args: DockerComposeBuildArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("build", args), options);
}

export function config(args: DockerComposeConfigArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("config", args), options);
}

export function configSync(args: DockerComposeConfigArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("config", args), options);
}

export function cp(args: DockerComposeCpArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("cp", args, ["src", "dest"]), options);
}

export function cpSync(args: DockerComposeCpArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("cp", args, ["src", "dest"]), options);
}

export function create(args: DockerComposeCreateArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("create", args), options);
}

export function createSync(args: DockerComposeCreateArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("create", args), options);
}

export function down(args: DockerComposeDownArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("down", args), options);
}

export function downSync(args: DockerComposeDownArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("down", args), options);
}

export function events(args: DockerComposeEventsArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("events", args), options);
}

export function eventsSync(args: DockerComposeEventsArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("events", args), options);
}

export function exec(args: DockerComposeExecArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("exec", args), options);
}

export function execSync(args: DockerComposeExecArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("exec", args), options);
}

export function images(args: DockerComposeImagesArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("images", args), options);
}

export function imagesSync(args: DockerComposeImagesArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("images", args), options);
}

export function kill(args: DockerComposeKillArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("kill", args), options);
}

export function killSync(args: DockerComposeKillArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("kill", args), options);
}

export function logs(args: DockerComposeLogsArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("logs", args), options);
}

export function logsSync(args: DockerComposeLogsArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("logs", args), options);
}

export function ls(args: DockerComposeLsArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("ls", args), options);
}

export function lsSync(args: DockerComposeLsArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("ls", args), options);
}

export function pause(args: DockerComposePauseArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("pause", args), options);
}

export function pauseSync(args: DockerComposePauseArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("pause", args), options);
}

export function port(args: DockerComposePortArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("port", args, ["service", "port"]), options);
}

export function portSync(args: DockerComposePortArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("port", args, ["service", "port"]), options);
}

export function ps(args: DockerComposePsArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("ps", args), options);
}

export function psSync(args: DockerComposePsArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("ps", args), options);
}

export function pull(args: DockerComposePullArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("pull", args), options);
}

export function pullSync(args: DockerComposePullArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("pull", args), options);
}

export function push(args: DockerComposePushArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("push", args), options);
}

export function pushSync(args: DockerComposePushArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("push", args), options);
}

export function restart(args: DockerComposeRestartArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("restart", args), options);
}

export function restartSync(args: DockerComposeRestartArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("restart", args), options);
}

export function rm(args: DockerComposeRmArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("rm", args), options);
}

export function rmSync(args: DockerComposeRmArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("rm", args), options);
}

export function run(args: DockerComposeRunArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("run", args), options);
}

export function runSync(args: DockerComposeRunArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("run", args), options);
}

export function start(args: DockerComposeStartArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("start", args), options);
}

export function startSync(args: DockerComposeStartArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("start", args), options);
}

export function stop(args: DockerComposeStopArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("stop", args), options);
}

export function stopSync(args: DockerComposeStopArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("stop", args), options);
}

export function top(args: DockerComposeTopArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("top", args), options);
}

export function topSync(args: DockerComposeTopArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("top", args), options);
}

export function unpause(args: DockerComposeUnpauseArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("unpause", args), options);
}

export function unpauseSync(args: DockerComposeUnpauseArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("unpause", args), options);
}

export function up(args: DockerComposeUpArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("up", args), options);
}

export function upSync(args: DockerComposeUpArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("up", args), options);
}

export function version(args: DockerComposeVersionArgs, options?: IExecOptions) {
    return compose(splatComposeArgs("version", args), options);
}

export function versionSync(args: DockerComposeVersionArgs, options?: IExecSyncOptions) {
    return compose.sync(splatComposeArgs("version", args), options);
}