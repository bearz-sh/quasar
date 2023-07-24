import { 
    IExecOptions, 
    IExecSyncOptions, 
    splat,
} from "../mod.ts";

import {
    DockerArgs,
    docker,
} from './base.ts'

export interface DockerContainerAttachArgs extends DockerArgs {
    container: string 
    detachKeys?: string;
    noStdin?: boolean;
    sigProxy?: boolean;
}

export interface DockerContainerCommitArgs extends DockerArgs {
    container: string;
    repository?: string;
    author?: string;
    change?: string[];
    message?: string;
    pause?: boolean;
}

export interface DockerContainerCpArgs extends DockerArgs {
    src: string;
    dest: string;
    archive?: string;
    followLink?: boolean;
    quiet?: boolean;
}



export interface DockerContainerCreateArgs extends DockerArgs {
    image: string;
    command?: string;
    args?: string[];
    addHost?: string[];
    annotation?: string[];
    attach?: string[];
    blkioWeight?: number;
    blkioWeightDevice?: string[];
    capAdd?: string[];
    capDrop?: string[];
    cgroupParent?: string;
    cgroupns?: string;
    cidfile?: string;
    cpuPeriod?: number;
    cpuQuota?: number;
    cpuRtPeriod?: number;
    cpuRtRuntime?: number;
    cpuShares?: number;
    cpus?: number;
    cpusetCpus?: string;
    cpusetMems?: string;
    device?: string[];
    deviceCgroupRules?: string[];
    deviceReadBps?: string[];
    deviceReadIops?: string[];
    disableContentTrust?: boolean;
    dns?: string[];
    dnsOption?: string[];
    dnsSearch?: string[];
    domainname?: string;
    entrypoint?: string;
    env?: string[];
    envFile?: string[];
    expose?: string[];
    gpus?: string
    groupAdd?: string[];
    healthCmd?: string;
    healthInterval?: string;
    healthRetries?: number;
    healthStartPeriod?: string;
    healthTimeout?: string;
    help?: boolean;
    hostname?: string;
    init?: boolean;
    interactive?: boolean;
    ip?: string;
    ip6?: string;
    ipc?: string;
    isolation?: string;
    kernelMemory?: string;
    label?: string[];
    labelFile?: string[];
    link?: string[];
    linkLocalIpV6?: string[];
    logDriver?: string;
    logOpt?: string[];
    macAddress?: string;
    memory?: string;
    memoryReservation?: string;
    memorySwap?: string;
    memorySwappiness?: number;
    mount?: string[];
    name?: string;
    network?: string;
    networkAlias?: string[];
    noHealthcheck?: boolean;
    oomKillDisable?: boolean;
    oomScoreAdj?: number;
    pid: string;
    pidsLimit?: number;
    platform?: string;
    privileged?: boolean;
    publish?: string[];
    publishAll?: boolean;
    pull?: 'always' | 'missing' | 'never';
    quiet?: boolean;
    readOnly?: boolean;
    restart?: string;
    rm?: boolean;
    runtime?: string;
    securityOpt?: string[];
    shmSize?: string;
    stopSignal?: string;
    stopTimeout?: number;
    storageOpt?: string[];
    sysctl?: string[];
    tmpfs?: string[];
    tty?: boolean;
    ulimit?: string[];
    user?: string;
    userns?: string;
    volume?: string[];
    volumeDriver?: string;
    volumesFrom?: string[];
    workdir?: string;
}

export interface DockerContainerDiffArgs extends DockerArgs {
    container: string;
}

export interface DockerContainerExecArgs extends DockerArgs {
    container: string;
    command: string;
    args?: string[];
    detach?: boolean;
    detachKeys?: string;
    env?: string[];
    envFile?: string[];
    interactive?: boolean;
    privileged?: boolean;
    tty: boolean;
    user?: string;
    workdir?: string;
}

export interface DockerContainerExportArgs extends DockerArgs {
    container: string;
    output?: string;
}

export interface DockerContainerInspectArgs extends DockerArgs {
    nameOrId: string[];
    format?: string;
    size?: boolean;
    type?: string;
}

export interface DockerContainerKillArgs extends DockerArgs {
    container: string[];
    signal?: string;
}

export interface DockerContainerLogs extends DockerArgs {
    container: string;
    details?: boolean;
    follow?: boolean;
    since?: string;
    tail?: string;
    timestamps?: boolean;
    until?: string;
}

export interface DockerContainerLsArgs extends DockerArgs {
    all?: boolean;
    filter?: string;
    format?: string;
    last?: number;
    latest?: boolean;
    noTrunc?: boolean;
    quiet?: boolean;
    size?: boolean;
}

export interface DockerPauseArgs extends DockerArgs {
    container: string[];
}

export interface DockerPortArgs extends DockerArgs {
    container: string;
    port: string;
}

export interface DockerContainerPruneArgs extends DockerArgs {
    all?: boolean;
    filter?: string;
}

export interface DockerContainerRenameArgs extends DockerArgs {
    container: string;
    name: string;
}

export interface DockerContainerRestartArgs extends DockerArgs {
    container: string;
    time?: number;
    signal?: string;
}

export interface DockerContainerRmArgs extends DockerArgs {
    container: string[];
    force?: boolean;
    link?: boolean;
    volumes: boolean;
}



export interface DockerRunArgs extends DockerArgs {
    image: string;
    command?: string;
    args?: string[];
    addHost?: string[];
    annotation?: string[];
    attach?: string[];
    blkioWeight?: number;
    blkioWeightDevice?: string[];
    capAdd?: string[];
    capDrop?: string[];
    cgroupParent?: string;
    cgroupns?: string;
    cidfile?: string;
    cpuPeriod?: number;
    cpuQuota?: number;
    cpuRtPeriod?: number;
    cpuRtRuntime?: number;
    cpuShares?: number;
    cpus?: number;
    cpusetCpus?: string;
    cpusetMems?: string;
    detach?: boolean;
    detachKeys?: string;
    device?: string[];
    deviceCgroupRules?: string[];
    deviceReadBps?: string[];
    deviceReadIops?: string[];
    deviceWriteBps?: string[];
    deviceWriteIops?: string[];
    disableContentTrust?: boolean;
    dns?: string[];
    dnsOption?: string[];
    dnsSearch?: string[];
    domainname?: string;
    entrypoint?: string;
    env?: string[];
    envFile?: string[];
    expose?: string[];
    gpus?: string
    groupAdd?: string[];
    healthCmd?: string;
    healthInterval?: string;
    healthRetries?: number;
    healthStartPeriod?: string;
    healthTimeout?: string;
    help?: boolean;
    hostname?: string;
    init?: boolean;
    interactive?: boolean;
    ip?: string;
    ip6?: string;
    ipc?: string;
    isolation?: string;
    kernelMemory?: string;
    label?: string[];
    labelFile?: string[];
    link?: string[];
    linkLocalIpV6?: string[];
    logDriver?: string;
    logOpt?: string[];
    macAddress?: string;
    memory?: string;
    memoryReservation?: string;
    memorySwap?: string;
    memorySwappiness?: number;
    mount?: string[];
    name?: string;
    network?: string;
    networkAlias?: string[];
    noHealthcheck?: boolean;
    oomKillDisable?: boolean;
    oomScoreAdj?: number;
    pid: string;
    pidsLimit?: number;
    platform?: string;
    privileged?: boolean;
    publish?: string[];
    publishAll?: boolean;
    pull?: 'always' | 'missing' | 'never';
    quiet?: boolean;
    readOnly?: boolean;
    restart?: string;
    rm?: boolean;
    runtime?: string;
    securityOpt?: string[];
    shmSize?: string;
    stopSignal?: string;
    stopTimeout?: number;
    storageOpt?: string[];
    sysctl?: string[];
    tmpfs?: string[];
    tty?: boolean;
    ulimit?: string[];
    user?: string;
    userns?: string;
    uts?: string;
    volume?: string[];
    volumeDriver?: string;
    volumesFrom?: string[];
    workdir?: string;
}

export interface DockerStartArgs extends DockerArgs {
    container: string[];
    attach: boolean;
    detachKeys?: string;
    interactive?: boolean;
}


export interface DockerStatsArgs extends DockerArgs {
    container?: string[];
    all?: boolean;
    format?: string;
    noStream?: boolean;
    noTrunc?: boolean;
}


export interface DockerStopArgs extends DockerArgs {
    container: string[];
    time?: number;
}

export interface DockerTopArgs extends DockerArgs {
    container: string;
    psArgs?: string;
}

export interface DockerUnpauseArgs extends DockerArgs {
    container: string[];
}

export interface DockerUpdateArgs extends DockerArgs {
    container: string[]
    blkioWeight?: number;
    cpuPeriod?: number;
    cpuQuota?: number;
    cpuRtPeriod?: number;
    cpuRtRuntime?: number;
    cpuShares?: number;
    cpus?: number;
    cpusetCpus?: string;
    cpusetMems?: string;
    memory?: string;
    memoryReservation?: string;
    memorySwap?: string;
    pidLimit?: number;
    restart?: string;
}

export interface DockerWaitArgs extends DockerArgs {
    container: string[];
    condition?: 'not-running' | 'next-exit' | 'removed' | 'exited';
}

function container(options: IExecOptions) {
    return docker(["container"], options);
}

container.sync = function(options: IExecSyncOptions) {
    return docker.sync(["container"], options);
}

export function attach(args: DockerContainerAttachArgs, options?: IExecOptions) {
    return docker(["container", "attach", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function attachSync(args: DockerContainerAttachArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "attach", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function commit(args: DockerContainerCommitArgs, options?: IExecOptions) {
    return docker(["container", "commit", ...splat(args, {
        arguments: ["container", "repository"],
        appendArguments: true,
    })], options);
}

export function commitSync(args: DockerContainerCommitArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "commit", ...splat(args, {
        arguments: ["container", "repository"],
        appendArguments: true,
    })], options);
}

export function cp(args: DockerContainerCpArgs, options?: IExecOptions) {
    return docker(["container", "cp", ...splat(args, {
        arguments: ["src", "dest"],
        appendArguments: true,
    })], options);
}

export function cpSync(args: DockerContainerCpArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "cp", ...splat(args, {
        arguments: ["src", "dest"],
        appendArguments: true,
    })], options);
}

export function create(args: DockerContainerCreateArgs, options?: IExecOptions) {
    return docker(["container", "create", ...splat(args, {
        arguments: ["image", "command", "args"],
        appendArguments: true,
    })], options);
}

export function createSync(args: DockerContainerCreateArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "create", ...splat(args, {
        arguments: ["image", "command", "args"],
        appendArguments: true,
    })], options);
}


export function diff(args: DockerContainerDiffArgs, options?: IExecOptions) {
    return docker(["container", "diff", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function diffSync(args: DockerContainerDiffArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "diff", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function exec(args: DockerContainerExecArgs, options?: IExecOptions) {
    return docker(["container", "exec", ...splat(args, {
        arguments: ["container", "command", "args"],
        appendArguments: true,
    })], options);
}

export function execSync(args: DockerContainerExecArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "exec", ...splat(args, {
        arguments: ["container", "command", "args"],
        appendArguments: true,
    })], options);
}

export function _export(args: DockerContainerExportArgs, options?: IExecOptions) {
    return docker(["container", "export", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function exportSync(args: DockerContainerExportArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "export", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function inspect(args: DockerContainerInspectArgs, options?: IExecOptions) {
    return docker(["container", "inspect", ...splat(args, {
        arguments: ["nameOrId"],
        appendArguments: true,
    })], options);
}

export function inspectSync(args: DockerContainerInspectArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "inspect", ...splat(args, {
        arguments: ["nameOrId"],
        appendArguments: true,
    })], options);
}

export function kill(args: DockerContainerKillArgs, options?: IExecOptions) {
    return docker(["container", "kill", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function killSync(args: DockerContainerKillArgs, options?: IExecSyncOptions) {

    return docker.sync(["container", "kill", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function logs(args: DockerContainerLogs, options?: IExecOptions) {
    return docker(["container", "logs", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function logsSync(args: DockerContainerLogs, options?: IExecSyncOptions) {
    return docker.sync(["container", "logs", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function ls(args: DockerContainerLsArgs, options?: IExecOptions) {
    return docker(["container", "ls", ...splat(args)], options);
}

export function lsSync(args: DockerContainerLsArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "ls", ...splat(args)], options);
}

export function pause(args: DockerPauseArgs, options?: IExecOptions) {
    return docker(["container", "pause", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function pauseSync(args: DockerPauseArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "pause", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function port(args: DockerPortArgs, options?: IExecOptions) {
    return docker(["container", "port", ...splat(args, {
        arguments: ["container", "port"],
        appendArguments: true,
    })], options);
}

export function portSync(args: DockerPortArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "port", ...splat(args, {
        arguments: ["container", "port"],
        appendArguments: true,
    })], options);
}

export function prune(args: DockerContainerPruneArgs, options?: IExecOptions) {
    return docker(["container", "prune", ...splat(args)], options);
}

export function pruneSync(args: DockerContainerPruneArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "prune", ...splat(args)], options);
}

export function rename(args: DockerContainerRenameArgs, options?: IExecOptions) {
    return docker(["container", "rename", ...splat(args, {
        arguments: ["container", "name"],
        appendArguments: true,
    })], options);
}

export function renameSync(args: DockerContainerRenameArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "rename", ...splat(args, {
        arguments: ["container", "name"],
        appendArguments: true,
    })], options);
}

export function restart(args: DockerContainerRestartArgs, options?: IExecOptions) {
    return docker(["container", "restart", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function restartSync(args: DockerContainerRestartArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "restart", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function rm(args: DockerContainerRmArgs, options?: IExecOptions) {
    return docker(["container", "rm", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function rmSync(args: DockerContainerRmArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "rm", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function run(args: DockerRunArgs, options?: IExecOptions) {
    return docker(["container", "run", ...splat(args, {
        arguments: ["image", "command", "args"],
        appendArguments: true,
    })], options);
}

export function runSync(args: DockerRunArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "run", ...splat(args, {
        arguments: ["image", "command", "args"],
        appendArguments: true,
    })], options);
}

export function start(args: DockerStartArgs, options?: IExecOptions) {
    return docker(["container", "start", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function startSync(args: DockerStartArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "start", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function stats(args: DockerStatsArgs, options?: IExecOptions) {
    return docker(["container", "stats", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function statsSync(args: DockerStatsArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "stats", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function stop(args: DockerStopArgs, options?: IExecOptions) {
    return docker(["container", "stop", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function stopSync(args: DockerStopArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "stop", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function top(args: DockerTopArgs, options?: IExecOptions) {
    return docker(["container", "top", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function topSync(args: DockerTopArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "top", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function unpause(args: DockerUnpauseArgs, options?: IExecOptions) {
    return docker(["container", "unpause", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function unpauseSync(args: DockerUnpauseArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "unpause", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function update(args: DockerUpdateArgs, options?: IExecOptions) {
    return docker(["container", "update", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function updateSync(args: DockerUpdateArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "update", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function wait(args: DockerWaitArgs, options?: IExecOptions) {
    return docker(["container", "wait", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}

export function waitSync(args: DockerWaitArgs, options?: IExecSyncOptions) {
    return docker.sync(["container", "wait", ...splat(args, {
        arguments: ["container"],
        appendArguments: true,
    })], options);
}