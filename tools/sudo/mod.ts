import { PlatformNotSupportedError } from "../../errors/mod.ts";
import { IS_WINDOWS } from "../../os/constants.ts";
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

registerExe("sudo", {});

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