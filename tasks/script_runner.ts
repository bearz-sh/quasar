import { 
    IExecOptions, 
    IExecSyncOptions ,
    exec, 
    execSync, 
    findExe, 
    findExeSync, 
    generateScriptFile, 
    generateScriptFileSync, 
    registerExe,
    } from '../process/exec.ts';
import { PsOutput } from '../process/ps.ts';
import { IS_WINDOWS } from '../os/constants.ts';
import { exists, existsSync, rm, rmSync, } from '../fs/mod.ts';


export interface IScriptRunner {
    run(script: string, options?: IExecOptions): Promise<PsOutput>;

    runSync(script: string, options?: IExecSyncOptions): PsOutput;

    runFile(file: string, options?: IExecOptions): Promise<PsOutput>;

    runFileSync(file: string, options?: IExecSyncOptions): PsOutput;
}

class ScriptRunner {
    #map: Map<string, IScriptRunner>;

    constructor() {
        this.#map = new Map<string, IScriptRunner>();
    }

    register(shell: string, scriptRunner: IScriptRunner) {
        this.#map.set(shell, scriptRunner);
    }

    has(shell: string): boolean {
        return this.#map.has(shell);
    }

    get(shell: string): IScriptRunner | undefined {
        return this.#map.get(shell);
    }

    run(shell: string, script: string, options?: IExecOptions): Promise<PsOutput> {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.run(script, options);
    }

    runSync(shell: string, script: string, options?: IExecSyncOptions): PsOutput {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runSync(script, options);
    }

    runFile(shell: string, file: string, options?: IExecOptions): Promise<PsOutput> {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runFile(file, options);
    }

    runFileSync(shell: string, file: string, options?: IExecSyncOptions): PsOutput {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runFileSync(file, options);
    }
}

export const scriptRunner = new ScriptRunner();


registerExe("bash", {
    windows: [
        "%ProgramFiles%\\Git\\bin\\bash.exe",
        "%ProgramFiles%\\Git\\usr\\bin\\bash.exe",
        '%ChocolateyInstall%\\msys2\\usr\\bin\\bash.exe',
        '%SystemDrive%\\msys64\\usr\\bin\\bash.exe',
        '%SystemDrive%\\msys\\usr\\bin\\bash.exe',
        '%SystemRoot%\\System32\\bash.exe',
    ]
});

// BASH

export function bash(args?: string[], options?: IExecOptions) {
    return exec("bash", args, options);
}

bash.cli = bash;
bash.sync = function bashSync(args?: string[], options?: IExecOptions) {
    return execSync("bash", args, options);
}

bash.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await bash(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", scriptFile], options);
}

bash.scriptFileSync = function bashScriptFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return bash.sync(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", scriptFile], options);
}

bash.script = async function(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try  {
        let file = scriptFile;

        
        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = await findExe("bash");
            if (exe?.endsWith("System32\\bash.exe")) {
                file = '/mnt/' + 'c' + file.substring(1).replace(':', '');
            }
        } else {
            await Deno.chmod(scriptFile, 0o777);
        }

        return await bash(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", file], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

bash.scriptSync = function bashScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try  {
        let file = scriptFile;

       

        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = findExeSync("bash");
            if (exe?.endsWith("System32\\bash.exe")) {
                file = '/mnt/' + 'c' + file.substring(1).replaceAll('\\', '/').replace(':', '');
            }
        } else {
            Deno.chmodSync(scriptFile, 0o777);
        }

        return bash.sync(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", file], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

scriptRunner.register("bash", {
    run: bash.script,
    runSync: bash.scriptSync,
    runFile: bash.scriptFile,
    runFileSync: bash.scriptFileSync,
});


// POWERSHELL

export function powershell(args?: string[], options?: IExecOptions) {
    return exec("powershell", args, options);
}

powershell.cli = powershell;
powershell.sync = function(args?: string[], options?: IExecOptions) {
    return execSync("powershell", args, options);
}

powershell.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await powershell.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

powershell.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return powershell.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

powershell.script = async function(script: string, options?: IExecOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`
    const scriptFile = await generateScriptFile(script, ".ps1");
    try  {


        return await powershell(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

powershell.scriptSync = function(script: string, options?: IExecSyncOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`
    const scriptFile = generateScriptFileSync(script, ".ps1");
    try  {
        return powershell.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

scriptRunner.register("powershell", {
    run: powershell.script,
    runSync: powershell.scriptSync,
    runFile: powershell.scriptFile,
    runFileSync: powershell.scriptFileSync,
});


// PWSH
export function pwsh(args?: string[], options?: IExecOptions) {
    return exec("pwsh", args, options);
}

pwsh.cli = pwsh;
pwsh.sync = function(args?: string[], options?: IExecOptions) {
    return execSync("pwsh", args, options);
}

pwsh.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await pwsh.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

pwsh.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return pwsh.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

pwsh.script = async function(script: string, options?: IExecOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = await generateScriptFile(script, ".ps1");
    try  {
        return await pwsh.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

pwsh.scriptSync = function(script: string, options?: IExecSyncOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = generateScriptFileSync(script, ".ps1");
    try  {
        return pwsh.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

scriptRunner.register("pwsh", {
    run: pwsh.script,
    runSync: pwsh.scriptSync,
    runFile: pwsh.scriptFile,
    runFileSync: pwsh.scriptFileSync,
});




registerExe("sh", {
    windows: [
        "%ProgramFiles%\\Git\\usr\\bin\\sh.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sh.exe",
    ]
});


export function sh(args?: string[], options?: IExecOptions) {
    return exec("sh", args, options);
}

sh.cli = sh;
sh.sync = function(args?: string[], options?: IExecOptions) {
    return execSync("sh", args, options);
}

sh.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await sh.cli(['-e', scriptFile], options);
}

sh.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return sh.sync(['-e', scriptFile], options);
}

sh.script = async function(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try  {
        if (!IS_WINDOWS) {
            await Deno.chmod(scriptFile, 0o777);
        }
        return await sh.cli(['-e', scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

sh.scriptSync = function shScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try  {
        if (!IS_WINDOWS) {
            Deno.chmodSync(scriptFile, 0o777);
        }
        return sh.sync(['-e', scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

scriptRunner.register("sh", {
    run: sh.script,
    runSync: sh.scriptSync,
    runFile: sh.scriptFile,
    runFileSync: sh.scriptFileSync,
});
