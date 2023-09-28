import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";

registerExe("dotnet", {
    windows: [
        "%ProgramFiles%\\dotnet\\dotnet.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("dotnet", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("dotnet", args, options);
}
