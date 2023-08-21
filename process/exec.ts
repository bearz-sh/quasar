import { which, whichSync } from "./which.ts";
import { expand, get, set } from "../os/env.ts";
import { isFile, isFileSync, makeTempFileSync, readTextFileSync, writeTextFile } from "../fs/mod.ts";
import { IS_DARWIN, IS_WINDOWS } from "../os/constants.ts";
import { IPsStartInfo, output, outputSync, PsOutput } from "./ps.ts";
import { NotFoundOnPathError } from "../errors/mod.ts";
import { isAbsolute } from "../path/mod.ts";
import { existsSync } from "../mod.ts";
import { StringBuilder } from "../text/string_builder.ts";
import { writeTextFileSync } from "../mod.ts";

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

export async function findExe(name: string) {
    if (isAbsolute(name) && await isFile(name)) {
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

export interface IExecSyncOptions {
    /**
     * The working directory of the process.
     *
     * If not specified, the `cwd` of the parent process is used.
     */
    cwd?: string | URL;
    /**
     * Clear environmental variables from parent process.
     *
     * Doesn't guarantee that only `env` variables are present, as the OS may
     * set environmental variables for processes.
     */
    clearEnv?: boolean;
    /** Environmental variables to pass to the subprocess. */
    env?: Record<string, string>;
    /**
     * Sets the child process’s user ID. This translates to a setuid call in the
     * child process. Failure in the set uid call will cause the spawn to fail.
     */
    uid?: number;
    /** Similar to `uid`, but sets the group ID of the child process. */
    gid?: number;

    /** How `stdin` of the spawned process should be handled.
     *
     * Defaults to `"null"`. */
    stdin?: "piped" | "inherit" | "null";
    /** How `stdout` of the spawned process should be handled.
     *
     * Defaults to `"inherit"`. */
    stdout?: "piped" | "inherit" | "null";
    /** How `stderr` of the spawned process should be handled.
     *
     * Defaults to "inherit". */
    stderr?: "piped" | "inherit" | "null";

    /** Skips quoting and escaping of the arguments on Windows. This option
     * is ignored on non-windows platforms. Defaults to `false`. */
    windowsRawArguments?: boolean;
}

export interface IExecOptions extends IExecSyncOptions {
    /**
     * An {@linkcode AbortSignal} that allows closing the process using the
     * corresponding {@linkcode AbortController} by sending the process a
     * SIGTERM signal.
     *
     * Ignored by {@linkcode Command.outputSync}.
     */
    signal?: AbortSignal;

    input?: string | Uint8Array | PsOutput | ReadableStream<Uint8Array>;
}

export async function exec(name: string, args?: string[], options?: IExecOptions) {
    const path = await findExe(name);
    if (!path) {
        throw new NotFoundOnPathError(name);
    }

    const si: IPsStartInfo = {
        ...options,
        file: path,
        args: args,
    };

    if (si.stdout === undefined) {
        si.stdout = "inherit";
    }

    if (si.stderr === undefined) {
        si.stderr = "inherit";
    }

    if (si.input) {
        si.stdin = "piped";
    }

    return await output(si);
}

export function execSync(name: string, args?: string[], options?: IExecSyncOptions) {
    const path = findExeSync(name);
    if (!path) {
        throw new NotFoundOnPathError(name);
    }

    const si: IPsStartInfo = {
        ...options,
        file: path,
        args: args,
    };

    if (si.stdout === undefined) {
        si.stdout = "inherit";
    }

    if (si.stderr === undefined) {
        si.stderr = "inherit";
    }

    return outputSync(si);
}

export function generateScriptFileSync(script: string, ext: string, tpl?: string) {
    const scriptFile = makeTempFileSync({ prefix: "quasar_scripts", suffix: ext });
    if (tpl) {
        writeTextFileSync(scriptFile, tpl.replace("{{script}}", script));
    } else {
        writeTextFileSync(scriptFile, script);
    }

    return scriptFile.replaceAll("\\", "/");
}

export async function generateScriptFile(script: string, ext: string, tpl?: string) {
    const scriptFile = makeTempFileSync({ prefix: "quasar_scripts", suffix: ext });
    if (tpl) {
        await writeTextFile(scriptFile, tpl.replace("{{script}}", script));
    } else {
        await writeTextFile(scriptFile, script);
    }

    return scriptFile.replaceAll("\\", "/");
}

function updateProfile(profile: string, name: string, path: string) {
    const lines = readTextFileSync(profile).split(`\n`);
    let updated = false;
    const sb = new StringBuilder();
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith(`### QUASAR ${name} ### `)) {
            sb.appendLine(line);
            sb.appendLine(`export PATH=\"$PATH:${path}\"`);
            sb.appendLine(`### END QUASAR ${name} ###`);
            sb.appendLine("");
            i = i + 3;
            updated = true;
            break;
        }

        sb.appendLine(line);
    }

    if (!updated) {
        sb.appendLine("");
        sb.appendLine(`### QUASAR ${name} ### `);
        sb.appendLine(`export PATH=\"$PATH:${path}\"`);
        sb.appendLine(`### END QUASAR ${name} ###`);
        sb.appendLine("");
    }

    writeTextFileSync(profile, sb.toString());
}

export function switchPath(name: string, path: string, target: "user" | "machine" | "process" = "process") {
    const options = registry.get(name);
    if (!options) {
        throw new Error(`Unknown tool ${name}`);
    }

    options.envVariable ??= options.name.toUpperCase() + "_PATH";
    set(options.envVariable, path);

    switch (target) {
        case "process":
            return;
        case "user":
            if (IS_WINDOWS) {
                execSync("setx", [options.envVariable, path]);
                return;
            } else {
                const home = get("HOME");
                const shell = get("SHELL");
                if (!home || !shell) {
                    throw new Error("Unable to determine home directory or shell");
                }

                switch (shell) {
                    case "/bin/bash": {
                        const profiles = [
                            `${home}/.bash_profile`,
                            `${home}/.bash_login`,
                            `${home}/.profile`,
                        ];

                        for (const profile of profiles) {
                            if (existsSync(profile)) {
                                updateProfile(profile, options.name, path);

                                return;
                            }
                        }

                        throw new Error(`Unable to find profile for ${shell}`);
                    }

                    case "/bin/zsh": {
                        const profiles = [
                            `${home}/.zshenv`,
                            `${home}/.zprofile`,
                            `${home}/.zshrc`,
                        ];

                        for (const profile of profiles) {
                            if (existsSync(profile)) {
                                updateProfile(profile, options.name, path);
                                set(options.envVariable, path);
                                return;
                            }
                        }

                        throw new Error(`Unable to find profile for ${shell}`);
                    }

                    default:
                        throw new Error(`Unknown shell ${shell}`);
                }
            }

        case "machine":
            if (IS_WINDOWS) {
                execSync("setx", [options.envVariable, path, "/m"]);
                return;
            } else {
                const shell = get("SHELL");
                if (!shell) {
                    throw new Error("Unable to determine shell");
                }

                switch (shell) {
                    case "/bin/bash": {
                        const profile = "/etc/profile";
                        if (!existsSync(profile)) {
                            throw new Error(`Unable to find ${profile}`);
                        }

                        updateProfile(profile, options.name, path);
                        return;
                    }
                    case "/bin/zsh": {
                        const profile = "/etc/zprofile";
                        if (!existsSync(profile)) {
                            throw new Error(`Unable to find ${profile}`);
                        }

                        updateProfile(profile, options.name, path);
                        return;
                    }

                    default:
                        throw new Error(`Unknown shell ${shell}`);
                }
            }

        default:
            throw new Error(`Unknown target ${target}`);
    }
}
