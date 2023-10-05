
import { IExecOptions, IExecSyncOptions, registerExe } from "../core/mod.ts";
import { ExecArgs, IS_WINDOWS, ISplatOptions, chmod, chmodSync, exists, existsSync, findExe, findExeSync, rm, rmSync, shell, whichSync } from "../deps.ts";
import { generateScriptFile, generateScriptFileSync } from "../mod.ts";

let exe = "bash";

registerExe("bash", {
    windows: [
        "%ProgramFiles%\\Git\\bin\\bash.exe",
        "%ProgramFiles%\\Git\\usr\\bin\\bash.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys\\usr\\bin\\bash.exe",
        "%SystemRoot%\\System32\\bash.exe",
    ],
});

const splatArgs : ISplatOptions = {
    shortFlag: true,
    appendArguments: true,
}

/**
 * Gets or sets the location of the bash executable.
 * 
 * @param path optional. The path to the bash executable.
 * @returns the bash location
 */
export function location(path?: string) {
    if (path)
        exe = path;

    return whichSync(exe);
}

/**
 * Executes a bash command.
 * 
 * @example
 * ```ts
 * exec(["-c", "echo hello world"]);
 * ```
 * 
 * @param args The arguments to pass to bash.
 * @param options The options to use.
 * @returns The output of the command.
 */
export function exec(args?: ExecArgs, options?: IExecOptions) {
    const o = options ?? {};
    o.splat ??= splatArgs;

    return shell.exec(exe, args, options);
}

export function execSync(args: ExecArgs, options?: IExecSyncOptions) {
    const o = options ?? {};
    o.splat ??= splatArgs;

    return shell.execSync(exe, args, options);
}


export function capture(args?: ExecArgs, options?: IExecOptions) {
    const o = options ?? {};
    o.splat ??= splatArgs;

    return shell.capture(exe, args, options);
}

export function captureSync(args: ExecArgs, options?: IExecSyncOptions) {
    const o = options ?? {};
    o.splat ??= splatArgs;

    return shell.captureSync(exe, args, options);
}

export function ps(args?: ExecArgs, options?: IExecOptions) {
    const o = options ?? {};
    o.splat ??= splatArgs;

    return shell.ps(exe, args, options);
}

export async function script(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try {
        let file = scriptFile;

        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = await findExe("bash");
            if (exe?.endsWith("System32\\bash.exe") || exe?.endsWith("system32\\bash.exe")) {
                file = "/mnt/" + "c" + file.substring(1).replace(":", "");
            }
            console.log(exe);
        } else {
            await chmod(scriptFile, 0o777);
        }

        const args = ["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", file];
        return await shell.exec(exe, args, options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function scriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try {
        let file = scriptFile;

        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = findExeSync("bash");
            if (exe?.endsWith("System32\\bash.exe") || exe?.endsWith("system32\\bash.exe")) {
                file = "/mnt/" + "c" + file.substring(1).replaceAll("\\", "/").replace(":", "");
            }
        } else {
            chmodSync(scriptFile, 0o777);
        }

        const args = ["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", file];
        return shell.execSync(exe, args, options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}

export async function file(scriptFile: string, options?: IExecOptions) {
    return await shell.exec(exe, ["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", scriptFile], options);
}

export function fileSync(scriptFile: string, options?: IExecSyncOptions) {
    return shell.execSync(exe, ["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", scriptFile], options);
}