import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("docker", {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("docker", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("docker", args, options);
}
