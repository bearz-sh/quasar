export {
    exec,
    execSync,
    findExe,
    findExeSync,
    generateScriptFile,
    generateScriptFileSync,
    PsOutput,
    registerExe,
} from "../../process/mod.ts";
export type { IExecOptions, IExecSyncOptions } from "../../process/mod.ts";

export { IS_WINDOWS } from "../../os/constants.ts";
export { chmod, chmodSync, exists, existsSync, rm, rmSync } from "../../fs/fs.ts";
export { splat } from "../../process/splat.ts";
