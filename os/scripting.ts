import {
    DIR_SEPARATOR,
    IS_DARWIN,
    IS_LINUX,
    IS_WINDOWS,
    NEW_LINE,
    OS_FAMILY,
    OsFamily,
    PATH_SEPARATOR,
    RUNTIME_ARCH,
    RuntimeArch,
} from "./constants.ts";
import { IEnvSubstitutionOptions } from "./env.ts";
import { expand, get, getOrDefault, getRequired, has, path, remove, set, toObject } from "./env.ts";

export interface IEnvPath {
    get(): string;

    set(path: string): void;

    add(value: string, prepend?: boolean): void;

    remove(value: string): void;

    has(value: string): boolean;

    split(): string[];
}

export interface IEnv {
    expand(template: string, options?: IEnvSubstitutionOptions): string;

    get(name: string): string | undefined;

    getOrDefault(key: string, defaultValue: string): string;

    getRequired(name: string): string;

    set(key: string, value: string): void;
    set(key: string, value: string, isSecret: boolean): void;
    set(map: { [key: string]: string }): void;

    remove(name: string): void;

    has(name: string): boolean;

    toObject(): Record<string, string | undefined>;

    path: IEnvPath;
}

export const env: IEnv = {
    expand,
    get,
    getOrDefault,
    getRequired,
    set,
    remove,
    has,
    toObject,
    path,
};

export interface IOperatingSystem {
    platform: OsFamily;
    isWindows: boolean;
    isLinux: boolean;
    isDarwin: boolean;
    arch: RuntimeArch;
    pathSeparator: string;
    directorySeparator: string;
    newLine: string;
}

export const os: IOperatingSystem = {
    arch: RUNTIME_ARCH,
    platform: OS_FAMILY,
    directorySeparator: DIR_SEPARATOR,
    isDarwin: IS_DARWIN,
    isLinux: IS_LINUX,
    isWindows: IS_WINDOWS,
    newLine: NEW_LINE,
    pathSeparator: PATH_SEPARATOR,
};
