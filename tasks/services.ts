import { IEnv, IFileSystem, IOperatingSystem, IPath, IProcess } from "./interfaces.ts";
import {
    args,
    capture,
    captureSync,
    chdir,
    cwd,
    exec,
    execSync,
    exit,
    findExe,
    findExeSync,
    isatty,
    registerExe,
    run,
    runSync,
} from "../process/mod.ts";
import { isProcessElevated } from "../os/os.ts";
import { err, ok, Result } from "../optional/result.ts";
export { none, Option, some } from "../optional/option.ts";
import * as env2 from "../os/env.ts";
import * as path2 from "../path/mod.ts";
import * as fs2 from "../fs/mod.ts";
export * as str from "../text/str.ts";
import { secretMasker } from "../secrets/mod.ts";
import { CaseInsensitiveMap } from "../collections/case_insensitive_map.ts";
export { StringBuilder } from "../text/string_builder.ts";
export * from "../secrets/mod.ts";

import {
    DIR_SEPARATOR,
    IS_DARWIN,
    IS_LINUX,
    IS_WINDOWS,
    NEW_LINE,
    PATH_SEPARATOR,
    RUNTIME_ARCH,
} from "../os/constants.ts";

export const fs: IFileSystem = fs2;
export const path: IPath = path2;

export { CaseInsensitiveMap, err, findExe, findExeSync, ok, registerExe, Result, secretMasker };

export const os: IOperatingSystem = {
    arch: RUNTIME_ARCH,
    platform: Deno.build.os,
    directorySeparator: DIR_SEPARATOR,
    isDarwin: IS_DARWIN,
    isLinux: IS_LINUX,
    isWindows: IS_WINDOWS,
    newLine: NEW_LINE,
    pathSeparator: PATH_SEPARATOR,
};

export const env: IEnv = {
    expand: env2.expand,
    get: env2.get,
    getOrDefault: env2.getOrDefault,
    getRequired: env2.getRequired,
    set: env2.set,
    remove: env2.remove,
    has: env2.has,
    toObject: env2.toObject,
    path: env2.path,
};

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
    capture,
    captureSync,
    run,
    runSync,
    isatty,
    exec,
    execSync,
    exit,
};

Reflect.defineProperty(ps, "cwd", {
    get: () => cwd(),
    set: (value: string) => chdir(value),
    enumerable: true,
    configurable: true,
});

export const secrets = new CaseInsensitiveMap<string>();
