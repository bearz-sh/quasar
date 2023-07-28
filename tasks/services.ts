import { IEnv, IProcess, IOperatingSystem, IFileSystem, IPath } from "./interfaces.ts";
import { args, cwd, chdir, capture, run, IExecOptions, exec as exec2, registerExe, findExe, findExeSync  } from '../process/mod.ts'
import { isProcessElevated } from "../os/os.ts";
import { ok, err, Result } from "../optional/result.ts";
export { some, none, Option } from "../optional/option.ts";
import * as env2 from "../os/env.ts";
import * as path2 from "../path/mod.ts";
import * as fs2 from '../fs/mod.ts'
export * as str from '../str.ts';
import { secretMasker } from "../secrets/mod.ts";
import { CaseInsensitiveMap } from "../collections/case_insensitive_map.ts";
export { StringBuilder } from "../string-builder.ts";
export * from "../secrets/mod.ts";

import { 
    IS_DARWIN,
    RUNTIME_ARCH, 
    IS_LINUX, 
    IS_WINDOWS, 
    NEW_LINE, 
    PATH_SEPARATOR,
    DIR_SEPARATOR,
} from '../os/constants.ts';

export const fs :IFileSystem = fs2;
export const path: IPath = path2;

export { 
    CaseInsensitiveMap, 
    ok, 
    err, 
    Result,
    secretMasker,
    findExe,
    findExeSync,
    registerExe
}

export const os: IOperatingSystem = {
    arch: RUNTIME_ARCH,
    platform: Deno.build.os,
    directorySeparator: DIR_SEPARATOR,
    isDarwin: IS_DARWIN,
    isLinux: IS_LINUX,
    isWindows: IS_WINDOWS,
    newLine: NEW_LINE,
    pathSeparator: PATH_SEPARATOR
}

export const env : IEnv = {
    expand: env2.expand,
    get: env2.get,
    getOrDefault: env2.getOrDefault,
    getRequired: env2.getRequired,
    set: env2.set,
    remove: env2.remove,
    has: env2.has,
    toObject: env2.toObject,
    path: env2.path
}

const defaultCwd = cwd();
const cwdHistory: string[] = [];

export const ps: IProcess = {
    args: args,
    cwd: "", 
    isElevated: isProcessElevated(),
    push(path: string) {
        cwdHistory.push(cwd());
        chdir(path);
    },
    pop() {
        const last = cwdHistory.pop() || defaultCwd;
        chdir(last);
        return last;
    },
    async capture(...args: string[]) {
        try {
            const result = await capture(...args);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    },
    async run(...args: string[]) {
        try {
            const result = await run(...args);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    },

    async exec(exec: string, args?: string[], options?: IExecOptions) {
        try {
            const result = await exec2(exec, args, options);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    }
}

Reflect.defineProperty(ps, "cwd", {
    get: () => cwd(),
    set: (value: string) => chdir(value),
    enumerable: true,
    configurable: true
});

export const secrets = new CaseInsensitiveMap<string>();