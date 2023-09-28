import {
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

let exe = "powershell";

if (!IS_WINDOWS) {
    exe = "pwsh";
    registerExe("pwsh", {
        windows: [
            "%ProgramFiles%/PowerShell/7/powershell.exe",
            "%ProgramFiles(x86)%/PowerShell/7/powershell.exe",
            "%ProgramFiles%/PowerShell/6/powershell.exe",
            "%ProgramFiles(x86)%/PowerShell/6/powershell.exe",
        ],
    });
} else {
    registerExe("powershell", {
        windows: [
            "%SystemRoot%/System32/WindowsPowerShell/v1.0/powershell.exe",
        ],
    });
}

export function cli(args?: string[], options?: IExecOptions) {
    return exec(exe, args, options);
}

export function cliSync(args?: string[], options?: IExecSyncOptions) {
    return execSync(exe, args, options);
}

export async function runFile(scriptFile: string, options?: IExecOptions) {
    return await cli([
        "-ExecutionPolicy",
        "Bypass",
        "-NoLogo",
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `. ${scriptFile}`,
    ], options);
}

export function runFileSync(scriptFile: string, options?: IExecSyncOptions) {
    return cliSync([
        "-ExecutionPolicy",
        "Bypass",
        "-NoLogo",
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `. ${scriptFile}`,
    ], options);
}

export async function runScript(script: string, options?: IExecOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = await generateScriptFile(script, ".ps1");
    try {
        return await cli([
            "-ExecutionPolicy",
            "Bypass",
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            `. ${scriptFile}`,
        ], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile);
        }
    }
}

export function runScriptSync(script: string, options?: IExecSyncOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = generateScriptFileSync(script, ".ps1");
    try {
        return cliSync([
            "-ExecutionPolicy",
            "Bypass",
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            `. ${scriptFile}`,
        ], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile);
        }
    }
}
