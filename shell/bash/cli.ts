import {
    chmod,
    chmodSync,
    exec,
    execSync,
    exists,
    existsSync,
    findExe,
    findExeSync,
    generateScriptFile,
    generateScriptFileSync,
    IExecOptions,
    IExecSyncOptions,
    IS_WINDOWS,
    registerExe,
    rm,
    rmSync,
} from "../core/mod.ts";

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

// BASH

export function cli(args?: string[], options?: IExecOptions) {
    return exec("bash", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("bash", args, options);
}

export async function runFile(scriptFile: string, options?: IExecOptions) {
    return await cli(["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", scriptFile], options);
}

export function runFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return cliSync(["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", scriptFile], options);
}

export async function runScript(script: string, options?: IExecOptions) {
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
        return await cli(args, options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function runScriptSync(script: string, options?: IExecSyncOptions) {
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

        return cliSync(["-noprofile", "--norc", "-e", "-o", "pipefail", "-c", file], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}
