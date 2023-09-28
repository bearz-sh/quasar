import {
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

registerExe("deno", {
    windows: [
        "%ChocolateyInstall%\\lib\\deno\\tools\\deno.exe",
    ],
});

export function cli(args?: string[], options?: IExecOptions) {
    return exec("deno", args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync("deno", args, options);
}

export async function runFile(scriptFile: string, options?: IExecOptions) {
    return await cli(["run", "-A", "--unstable", scriptFile], options);
}

export function runFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return cliSync(["run", "-A", "--unstable", scriptFile], options);
}

export async function runScript(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".ts");
    try {
        return await cli(["run", "-A", "--unstable", scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function runScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".ts");
    try {
        if (!IS_WINDOWS) {
            chmodSync(scriptFile, 0o777);
        }

        return cliSync(["run", "-A", "--unstable", scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}
