export {
    exec,
    execSync,
    findExe,
    findExeSync,
    generateScriptFile,
    generateScriptFileSync,
    registerExe,
    PsOutput,
} from "../../process/mod.ts";
export type {    
    IExecOptions,
    IExecSyncOptions, } from "../../process/mod.ts";

export { IS_WINDOWS } from "../../os/constants.ts";
export { exists, existsSync, rm, rmSync, chmod, chmodSync } from "../../fs/fs.ts";
export { splat } from "../../process/splat.ts"