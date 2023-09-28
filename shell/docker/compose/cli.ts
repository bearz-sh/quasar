import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../../core/mod.ts";

registerExe("docker-compose", {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker-compose.exe",
    ],
    linux: [
        "/usr/local/lib/docker/cli-plugins/docker-compose",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("docker-compose", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("docker-compose", args, options);
}
