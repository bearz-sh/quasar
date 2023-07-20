import { rm, rmSync } from "../../fs/fs.ts";
import { exists, existsSync } from "../../fs/mod.ts";
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync,
    generateScriptFile, 
    generateScriptFileSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("pwsh", {
    windows: [
        "%ProgramFiles%/PowerShell/7/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/7/pwsh.exe",
        "%ProgramFiles%/PowerShell/6/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/6/pwsh.exe",
    ]
});


export function pwsh(args?: string[], options?: IExecOptions) {
    return exec("pwsh", args, options);
}

pwsh.cli = pwsh;
pwsh.cliSync = function(args?: string[], options?: IExecOptions) {
    return execSync("pwsh", args, options);
}

pwsh.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await pwsh.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

pwsh.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return pwsh.cliSync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
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
        return pwsh.cliSync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}