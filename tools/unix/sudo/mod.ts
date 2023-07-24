import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe,
    IS_WINDOWS,
    PlatformNotSupportedError 
} from "../../mod.ts";

registerExe("sudo", {});

// TODO: expand sudo module to handle password prompts
export function sudo(args?: string[], options?: IExecOptions) {
    if (IS_WINDOWS) {
        throw new PlatformNotSupportedError("sudo is not supported on Windows.");
    }
    return exec("sudo", args, options);
}

sudo.cli = sudo;
sudo.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (IS_WINDOWS) {
        throw new PlatformNotSupportedError("sudo is not supported on Windows.");
    }

    return execSync("sudo", args, options);
}