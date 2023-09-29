// This is a modified version of the dargs npm package
// https://github.com/sindresorhus/dargs
// which is under under MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

import { dasherize, underscore } from "../text/inflections.ts";

const match = (array: unknown[], value: string) =>
    array.some((element) => (element instanceof RegExp ? element.test(value) : element === value));

export interface SplatOptions {
    /**
     * The command to use. The command array is prepend to the front of the command line. Default: `undefined`.
     */
    command?: string[];

    /**
     * The prefix to use for options such as `--foo bar`. Default: `--`.
     */
    prefix?: string;
    /** alias an option.  the alias value must include the case and prefix such as --, -, or /
     *
     * @example
     * ```ts
     * splat({ foo: "bar" }, { aliases: { foo: "/f" } });
     * ```
     */
    aliases?: Record<string, string>;
    /**
     * The assignment operator to use for options such as `--foo=bar`. When set to undefined,
     * only the key will be used, resulting in `--foo bar`.
     */
    assign?: string;
    /**
     * Preserve the case of the key. Default: `false`.
     */
    preserveCase?: boolean;
    /**
     * Forces the use of short flags for all prefixes. Default: `true`.
     */
    shortFlag?: boolean;
    /**
     * Only include the given keys. Default: `undefined`.
     */
    includes?: Array<string | RegExp>;
    /**
     * Exclude the given keys. Default: `undefined`.
     */
    excludes?: Array<string | RegExp>;
    /**
     * Ignore `true` values. Default: `false`.
     */
    ignoreTrue?: boolean;

    /**
     * Ignore `false` values. Default: `false`.
     */
    ignoreFalse?: boolean;
    /**
     * Maps the given keys to be used as positional arguments where only the values are emitted1. Default: `undefined`.
     */
    arguments?: string[];
    /**
     * Instructs all arguments to be appended to the end of the command line. Default: `false`.
     */
    appendArguments?: boolean;
}

/**
 * Converts an object to an array of command line arguments.
 * @param object The object to convert
 * @param options The options to use
 * @returns An array of command line arguments
 */
export function splat(object: Record<string, unknown>, options?: SplatOptions) {
    const splat = [];
    let extraArguments = [];
    let separatedArguments = [];

    options = {
        shortFlag: true,
        prefix: "--",
        ...options,
    };

    const makeArguments = (key: string, value?: unknown) => {
        const prefix = options?.shortFlag && key.length === 1 ? "-" : options?.prefix;
        const theKey = options?.preserveCase ? key : dasherize(underscore(key));

        key = prefix + theKey;

        if (options?.assign && typeof value !== "boolean") {
            splat.push(key + (value ? `${options.assign}${value}` : ""));
        } else {
            splat.push(key);

            if (value) {
                splat.push(value);
            }
        }
    };

    const makeAliasArg = (key: string, value?: unknown) => {
        if (options?.assign) {
            splat.push(key + (value ? `${options.assign}${value}` : ""));
        } else {
            splat.push(key);
            if (value) {
                splat.push(value);
            }
        }
    };

    const argz: unknown[] = [];
    if (options.arguments?.length) {
        argz.length = options.arguments.length;
    }

    for (let [key, value] of Object.entries(object)) {
        let pushArguments = makeArguments;
        if (options.arguments?.length && options.arguments.includes(key)) {
            // ensure the order of the arguments
            const index = options.arguments.indexOf(key);
            if (value !== undefined && value !== null) {
                argz[index] = value;
            }
            continue;
        }

        if (Array.isArray(options.excludes) && match(options.excludes, key)) {
            continue;
        }

        if (Array.isArray(options.includes) && !match(options.includes, key)) {
            continue;
        }

        if (typeof options.aliases === "object" && options.aliases[key]) {
            key = options.aliases[key];
            pushArguments = makeAliasArg;
        }

        if (key === "--") {
            if (!Array.isArray(value)) {
                throw new TypeError(
                    `Expected key \`--\` to be Array, got ${typeof value}`,
                );
            }

            separatedArguments = value;
            continue;
        }

        if (key === "_") {
            if (!Array.isArray(value)) {
                throw new TypeError(
                    `Expected key \`_\` to be Array, got ${typeof value}`,
                );
            }

            extraArguments = value;
            continue;
        }

        if (value === true && !options.ignoreTrue) {
            pushArguments(key, undefined);
        }

        if (value === false && !options.ignoreFalse) {
            pushArguments(`no-${key}`);
        }

        if (typeof value === "string") {
            pushArguments(key, value);
        }

        if (typeof value === "number" && !Number.isNaN(value)) {
            pushArguments(key, String(value));
        }

        if (Array.isArray(value)) {
            for (const arrayValue of value) {
                pushArguments(key, arrayValue);
            }
        }
    }

    for (const argument of extraArguments) {
        splat.push(String(argument));
    }

    if (separatedArguments.length > 0) {
        splat.push("--");
    }

    for (const argument of separatedArguments) {
        splat.push(String(argument));
    }

    if (argz.length) {
        const unwrapped: string[] = [];
        // ensure the order of the arguments
        for (const arg of argz) {
            if (arg) {
                if (Array.isArray(arg)) {
                    unwrapped.push(...arg.map((a) => String(a)));
                } else if (arg !== undefined && arg !== null) {
                    unwrapped.push(String(arg));
                }
            }
        }

        if (options.appendArguments) {
            splat.push(...unwrapped);
        } else {
            splat.splice(0, 0, ...unwrapped);
        }
    }

    if (options?.command?.length) {
        splat.splice(0, 0, ...options.command);
    }

    return splat;
}
