import {capture, captureSync, ps, exec, execSync } from "./../process/mod.ts";

export const shell = {
    capture,
    captureSync,
    ps,
    exec,
    execSync,
}
export { chmod, chmodSync, exists, existsSync, rm, rmSync} from "../fs/mod.ts";
export {  which, whichSync, registerExe, findExe, findExeSync, getEntry } from "./../process/mod.ts";
export { IS_WINDOWS, IS_DARWIN, expand, get } from "./../os/mod.ts";
export type { ExecArgs, ISplatOptions } from "../process/mod.ts"