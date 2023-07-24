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

function command(command: string, args?: string[], options?: IExecOptions) {
    if (args?.length) {
        args.splice(0, 0, command);
    }
    else {
        args = [command];
    }

    return docker(args, options);
}

function commandSync(command: string, args?: string[], options?: IExecSyncOptions) {
    if (args?.length) {
        args.splice(0, 0, command);
    }
    else {
        args = [command];
    }

    return docker.sync(args, options);
}

export function network(args?: string[], options?: IExecOptions) {
    return command("network", args, options);
}

export function networkSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("network", args, options);
}

export function context(args?: string[], options?: IExecOptions) {
    return command("context", args, options);
}

export function contextSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("context", args, options);
}

export function volume(args?: string[],options?: IExecOptions) {
    return command("volume", args, options);
}

export function volumeSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("volume", args, options);
}

export function image(args?: string[], options?: IExecOptions) {
    return command("image", args, options);
}

export function imageSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("image", args, options);
}

export function container(args?: string[], options?: IExecOptions) {
    return command("container", args, options);
}

export function containerSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("container", args, options);
}

export function node(args?: string[], options?: IExecOptions) {
    return command("no args", args, options);
}

export function nodeSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("no args", args, options);
}

export function serivce(args?: string[], options?: IExecOptions) {
    return command("service", args, options);
}

export function serviceSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("service", args, options);
}

export function stack(args?: string[], options?: IExecOptions) {
    return command("stack", args, options);
}

export function stackSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("stack", args, options);
}

export function swarm(args?: string[], options?: IExecOptions) {
    return command("swarm", args, options);
}

export function swarmSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("swarm", args, options);
}

export function secret(args?: string[], options?: IExecOptions) {
    return command("secret", args, options);
}

export function secretSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("secret", args, options);
}

export function config(args?: string[], options?: IExecOptions) {
    return command("config", args, options);
}

export function configSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("config", args, options);
}


export function plugin(args?: string[], options?: IExecOptions) {
    return command("plugin", args, options);
}

export function pluginSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("plugin", args, options);
}

export function trust(args?: string[], options?: IExecOptions) {
    return command("trust", args, options);
}

export function trustSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("trust", args, options);
}

export function search(args: DockerSearchArgs, options?: IExecOptions) {
    return docker(["search", ...splat(args, {
        arguments: ["term"],
        appendArguments: true,
    })], options);
}

export function searchSync(args: DockerSearchArgs, options?: IExecSyncOptions) {
    return docker.sync(["search", ...splat(args, {
        arguments: ["term"],
        appendArguments: true,
    })], options);
}

export function system(args?: string[], options?: IExecOptions) {
    return command("system", args, options);
}

export function systemSync(args?: string[], options?: IExecSyncOptions) {
    return commandSync("system", args, options);
}