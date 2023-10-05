import { isFile, isFileSync } from "../fs/fs.ts";
import { IS_DARWIN, IS_WINDOWS, expand, get } from "../os/mod.ts";
import { isAbsolute } from "../path/mod.ts";
import { underscore } from "../text/inflections.ts";
import { which, whichSync } from "./which.ts";


export interface IPathFinderOptions {
    name: string;
    executable?: string;
    envVariable?: string;
    cached?: string;
    paths?: string[];
    windows?: string[];
    linux?: string[];
    darwin?: string[];
}

const registry = new Map<string, IPathFinderOptions>();

export function registerExe(name: string, options?: Partial<IPathFinderOptions>, force = false) {
    let o = registry.get(name);
    if (o) {
        if (force && options) {
            if (options.cached) {
                o.cached = options.cached;
            }

            if (options.envVariable) {
                o.envVariable = options.envVariable;
            }

            if (options.executable) {
                o.executable = options.executable;
            }

            if (options.paths) {
                o.paths = options.paths;
            }

            if (options.windows) {
                o.windows = options.windows;
            }

            if (options.linux) {
                o.linux = options.linux;
            }

            if (options.darwin) {
                o.darwin = options.darwin;
            }
        }

        return o;
    }

    o = {
        ...options,
        name: name,
    };

    o.envVariable ??= name.toUpperCase() + "_PATH";
    registry.set(name, o);

    return o;
}

export function findExeSync(name: string) {
    if (isAbsolute(name) && isFileSync(name)) {
        return name;
    }

    let options = registry.get(name);
    if (!options) {
        options ??= {} as IPathFinderOptions;
        options.name = name;
        options.envVariable ??= options.name.toUpperCase() + "_PATH";
        options.paths ??= [];
        options.windows ??= [];
        options.linux ??= [];
        options.darwin ??= [];
        registry.set(name, options);
    }

    if (options?.envVariable) {
        const envPath = get(options.envVariable);
        if (envPath) {
            const path = whichSync(envPath);
            if (path && isFileSync(path)) {
                return path;
            }
        }
    }

    if (options?.cached) {
        return options.cached;
    }

    const defaultPath = whichSync(name);
    if (defaultPath && isFileSync(defaultPath)) {
        options.cached = defaultPath;
        return defaultPath;
    }

    if (IS_WINDOWS) {
        if (options?.windows?.length) {
            for (const path of options.windows) {
                let next = path;
                next = expand(next);
                if (isFileSync(next)) {
                    options.cached = next;
                    return next;
                }
            }
        }

        return undefined;
    }

    if (IS_DARWIN) {
        if (options?.darwin?.length) {
            for (const path of options.darwin) {
                let next = path;
                next = expand(next);
                if (isFileSync(next)) {
                    options.cached = next;
                    return next;
                }
            }
        }
    }

    if (options?.linux?.length) {
        for (const path of options.linux) {
            let next = path;
            next = expand(next);
            if (isFileSync(next)) {
                options.cached = next;
                return next;
            }
        }
    }

    return undefined;
}

export function getEntry(name: string) {
    let options = registry.get(name);
    if (!options) {
        options ??= {} as IPathFinderOptions;
        options.name = name;
        options.envVariable ??= underscore(options.name).toUpperCase() + "_PATH";
        options.paths ??= [];
        options.windows ??= [];
        options.linux ??= [];
        options.darwin ??= [];
        registry.set(name, options);
    }

    return options;
}

export function hasEntry(name: string) {
    return registry.has(name);
}

export async function findExe(name: string) {
    if (isAbsolute(name) && await isFile(name)) {
        return name;
    }

    let options = registry.get(name);
    if (!options) {
        options ??= {} as IPathFinderOptions;
        options.name = name;
        options.envVariable ??= underscore(options.name).toUpperCase() + "_PATH";
        options.paths ??= [];
        options.windows ??= [];
        options.linux ??= [];
        options.darwin ??= [];
        registry.set(name, options);
    }

    if (options?.envVariable) {
        const envPath = get(options.envVariable);
        if (envPath) {
            const path = await which(envPath);
            if (path && await isFile(path)) {
                return path;
            }
        }
    }

    if (options?.cached) {
        return options.cached;
    }

    const defaultPath = await which(name);
    if (defaultPath && await isFile(defaultPath)) {
        options.cached = defaultPath;
        return defaultPath;
    }

    if (IS_WINDOWS) {
        if (options?.windows?.length) {
            for (const path of options.windows) {
                let next = path;
                next = expand(next);
                if (await isFile(next)) {
                    options.cached = next;
                    return next;
                }
            }
        }

        return undefined;
    }

    if (IS_DARWIN) {
        if (options?.darwin?.length) {
            for (const path of options.darwin) {
                let next = path;
                next = expand(next);
                if (await isFile(next)) {
                    options.cached = next;
                    return next;
                }
            }
        }
    }

    if (options?.linux?.length) {
        for (const path of options.linux) {
            let next = path;
            next = expand(next);
            if (await isFile(next)) {
                options.cached = next;
                return next;
            }
        }
    }

    return undefined;
}