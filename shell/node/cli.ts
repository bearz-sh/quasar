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

registerExe("node", {
    windows: [
        "%ProgramFiles%\\nodejs\\node.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("node", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("node", args, options);
}

export async function runFile(scriptFile: string, options?: IExecOptions) {
    return await cli([scriptFile], options);
}

export function runFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return cliSync([scriptFile], options);
}

export async function runScript(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".js");
    try {
        if (!IS_WINDOWS) {
            await chmod(scriptFile, 0o777);
        }

        return await cli([scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function runScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".js");
    try {
        if (!IS_WINDOWS) {
            chmodSync(scriptFile, 0o777);
        }

        return cliSync([scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}
