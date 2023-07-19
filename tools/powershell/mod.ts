import { rm, rmSync } from "../../fs/fs.ts";
import { IS_WINDOWS } from "../../os/constants.ts";
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

let exe = "powershell";

if (!IS_WINDOWS) {
    exe = "pwsh";
    registerExe("pwsh", {
        windows: [
            "%ProgramFiles%/PowerShell/7/powershell.exe",
            "%ProgramFiles(x86)%/PowerShell/7/powershell.exe",
            "%ProgramFiles%/PowerShell/6/powershell.exe",
            "%ProgramFiles(x86)%/PowerShell/6/powershell.exe",
        ]
    });
} else {
    registerExe("powershell", {
        windows: [
            "%SystemRoot%/System32/WindowsPowerShell/v1.0/powershell.exe",
        ]
    });
}


export function powershell(args?: string[], options?: IExecOptions) {
    return exec(exe, args, options);
}

export function powershellSync(args?: string[], options?: IExecOptions) {
    return execSync(exe, args, options);
}

export async function powershellScript(script: string, options?: IExecOptions) {
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

export function powershellScriptSync(script: string, options?: IExecSyncOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`
    const scriptFile = generateScriptFileSync(script, ".ps1");
    try  {
        return powershellSync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}