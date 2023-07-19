import { rm, rmSync } from "../../fs/fs.ts";
import { exists, existsSync } from "../../fs/mod.ts";
import { IS_WINDOWS } from "../../os/constants.ts";
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    findExe, 
    findExeSync, 
    generateScriptFile, 
    generateScriptFileSync, 
    registerExe 
} from "../../process/exec.ts";

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


export function bash(args?: string[], options?: IExecOptions) {
    return exec("bash", args, options);
}

export function bashSync(args?: string[], options?: IExecOptions) {
    return execSync("bash", args, options);
}

export async function bashScript(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".sh");
    try  {
        let file = scriptFile;
        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = await findExe("bash");
            if (exe?.endsWith("System32\\bash.exe")) {
                file = '/mnt/' + 'c' + file.substring(1).replace(':', '');
            }
        }

        return await bash(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", file], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

export function bashScriptSync(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".sh");
    try  {
        let file = scriptFile;

        // windows with WSL installed has bash.exe in System32, but it doesn't handle windows paths
        if (IS_WINDOWS) {
            const exe = findExeSync("bash");
            if (exe?.endsWith("System32\\bash.exe")) {
                file = '/mnt/' + 'c' + file.substring(1).replaceAll('\\', '/').replace(':', '');
            }
        }

        return bashSync(['-noprofile', '--norc', '-e', '-o', 'pipefail', "-c", file], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}