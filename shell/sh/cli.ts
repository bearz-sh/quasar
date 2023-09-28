import {
    chmod,
    chmodSync,
    exec,
    execSync,
    exists,
    existsSync,
    generateScriptFile,
    generateScriptFileSync,
    IExecOptions,
    IExecSyncOptions,
    IS_WINDOWS,
    registerExe,
    rm,
    rmSync,
} from "../core/mod.ts";

registerExe("sh", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\sh.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sh.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("sh", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("sh", args, options);
}

export async function runFile(scriptFile: string, options?: IExecOptions) {
    return await cli(["-e", scriptFile], options);
}

export function runFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return cliSync(["-e", scriptFile], options);
}

export async function runScript(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try {
        if (!IS_WINDOWS) {
            await chmod(scriptFile, 0o777);
        }
        return await cli(["-e", scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function runScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try {
        if (!IS_WINDOWS) {
            chmodSync(scriptFile, 0o777);
        }
        return cliSync(["-e", scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}
