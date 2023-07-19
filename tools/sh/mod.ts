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

export function shSync(args?: string[], options?: IExecOptions) {
    return execSync("sh", args, options);
}

export async function shScript(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try  {

        return await sh(['-e', scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

export function shScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try  {
        return shSync(['-e', scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}