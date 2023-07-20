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

sh.cli = sh;
sh.cliSync = function(args?: string[], options?: IExecOptions) {
    return execSync("sh", args, options);
}

sh.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await sh.cli(['-e', scriptFile], options);
}

sh.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return sh.cliSync(['-e', scriptFile], options);
}

sh.script = async function(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try  {
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
        return sh.cliSync(['-e', scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

