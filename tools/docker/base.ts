import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    findExe, 
    findExeSync, 
    registerExe,
    splat,
} from "../mod.ts";



registerExe("docker", {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker.exe",
    ]
});

export function docker(args?: string[], options?: IExecOptions) {
    return exec("docker", args, options);
}

docker.cli = docker;
docker.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("docker", args, options);
}

export interface DockerArgs extends Record<string, unknown> {
    config?: string;
    context?: string;
    debug?: boolean;
    host?: string[],
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    tls?: boolean;
    tlscacert?: string;
    tlscert?: string;
    tlskey?: string;
    tlsverify?: boolean;
    version?: boolean;
}

registerExe("docker-buildx", {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker-buildx.exe",
    ],
    linux: [
        "/usr/local/bin/docker-buildx",
        "${HOME}/.rd/bin/docker-buildx",
    ]
});


export async function buildx(args?: string[], options?: IExecOptions) {
    const exe = await findExe("docker-buildx");

    if (exe) {
        return exec(exe, args, options);
    }

    if (args)
        args.splice(0, 0, "buildx");
    else
        args = ["buildx"];

    return exec("docker", args, options);
}

buildx.sync = function(args?: string[], options?: IExecSyncOptions) {
    const exe = findExeSync("docker-buildx");

    if (exe) {
        return execSync(exe, args, options);
    }

    if (args)
        args.splice(0, 0, "buildx");
    else
        args = ["buildx"];

    return execSync("docker", args, options);
}

registerExe("docker-compose", {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker-compose.exe",
    ],
    linux: [
        "/usr/local/bin/docker-compose",
        "${HOME}/.rd/bin/docker-compose",
    ]
});

export async function compose(args?: string[], options?: IExecOptions) {
    const exe = await findExe("docker-compose");

    if (exe) {
        return exec(exe, args, options);
    }

    if (args)
        args.splice(0, 0, "compose");
    else
        args = ["compose"];

    return exec("docker", args, options);
}

compose.sync = function(args?: string[], options?: IExecSyncOptions) {
    const exe = findExeSync("docker-compose");

    if (exe) {
        return execSync(exe, args, options);
    }

    if (args)
        args.splice(0, 0, "compose");
    else
        args = ["compose"];

    return execSync("docker", args, options);
}

export interface DockerVersionArgs extends DockerArgs {
    format?: string;
}

export interface DockerLoginArgs extends DockerArgs {
    server?: string
    username?: string;
    password?: string;
    passwordStdin?: boolean;
}

export interface DockerLogoutArgs extends DockerArgs {
    server?: string
}

export interface DockerSearchArgs extends DockerArgs {
    term: string;
    filter?: string;
    format?: string;
    limit?: number;
    noTrunc?: boolean;
}

export function version(args?: DockerVersionArgs, options?: IExecOptions) {
    args ??= {};
    return docker(["version", ...splat(args)], options);
}

export function versionSync(args?: DockerVersionArgs, options?: IExecSyncOptions) {
    args ??= {};
    return docker.sync(splat(args), options);
}

export function login(args: DockerLoginArgs, options?: IExecOptions) {
    return docker(["login", ...splat(args)], options);
}

export function loginSync(args: DockerLoginArgs, options?: IExecSyncOptions) {
    return docker.sync(splat(args), options);
}

export function logout(args: DockerLogoutArgs, options?: IExecOptions) {
    return docker(["logout", ...splat(args)], options);
}

export function logoutSync(args: DockerLogoutArgs, options?: IExecSyncOptions) {
    return docker.sync(splat(args), options);
}

export function network(args?: string[], options?: IExecOptions) {
    return docker(["network", ...args ?? []], options);
}

export function networkSync(args?: string[], options?: IExecSyncOptions) {
    args ??= [];
    return docker.sync(["network", ], options);
}

export function context(options: IExecOptions) {
    return docker(["context"], options);
}

export function contextSync(options: IExecSyncOptions) {
    return docker.sync(["context"], options);
}

export function volume(options: IExecOptions) {
    return docker(["volume"], options);
}

export function volumeSync(options: IExecSyncOptions) {
    return docker.sync(["volume"], options);
}

export function image(options: IExecOptions) {
    return docker(["image"], options);
}

export function imageSync(options: IExecSyncOptions) {
    return docker.sync(["image"], options);
}

export function container(options: IExecOptions) {
    return docker(["container"], options);
}

export function containerSync(options: IExecSyncOptions) {
    return docker.sync(["container"], options);
}

export function nodeargs(options: IExecOptions) {
    return docker(["no args"], options);
}

export function serivce(options: IExecOptions) {
    return docker(["service"], options);
}

export function serviceSync(options: IExecSyncOptions) {
    return docker.sync(["service"], options);
}

export function stack(options: IExecOptions) {
    return docker(["stack"], options);
}

export function stackSync(options: IExecSyncOptions) {
    return docker.sync(["stack"], options);
}

export function swarm(options: IExecOptions) {
    return docker(["swarm"], options);
}

export function swarmSync(options: IExecSyncOptions) {
    return docker.sync(["swarm"], options);
}

export function secret(options: IExecOptions) {
    return docker(["secret"], options);
}

export function secretSync(options: IExecSyncOptions) {
    return docker.sync(["secret"], options);
}

export function config(options: IExecOptions) {
    return docker(["config"], options);
}

export function configSync(options: IExecSyncOptions) {
    return docker.sync(["config"], options);
}


export function plugin(options: IExecOptions) {
    return docker(["plugin"], options);
}

export function pluginSync(options: IExecSyncOptions) {
    return docker.sync(["plugin"], options);
}

export function trust(options: IExecOptions) {
    return docker(["trust"], options);
}

export function trustSync(options: IExecSyncOptions) {
    return docker.sync(["trust"], options);
}

export function search(args: DockerSearchArgs, options?: IExecOptions) {
    return docker(["search", ...splat(args, {
        arguments: ["term"],
        appendArguments: true,
    })], options);
}

export function searchSync(args: DockerSearchArgs, options?: IExecSyncOptions) {
    return docker.sync(splat(args, {
        arguments: ["term"],
        appendArguments: true,
    }), options);
}


export function system(options: IExecOptions) {
    return docker(["system"], options);
}

export function systemSync(options: IExecSyncOptions) {
    return docker.sync(["system"], options);
}

