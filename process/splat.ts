// This is a modified version of the dargs npm package
// https://github.com/sindresorhus/dargs
// which is under under MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

import { dasherize, underscore } from "../text/inflections.ts";
import { ISplatOptions } from "./interfaces.ts";

const match = (array: unknown[], value: string) =>
    array.some((element) => (element instanceof RegExp ? element.test(value) : element === value));


/**
 * Converts an object to an array of command line arguments.
 * @param object The object to convert
 * @param options The options to use
 * @returns An array of command line arguments
 */
export function splat(object: Record<string, unknown>, options?: ISplatOptions) {
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

        if (options?.assign) {
            splat.push(key + (value ? `${options.assign}${value}` : ""));
        } else {
            splat.push(key);

            if (value) {
                splat.push(value);
            }
        }
    };

    const makeAliasArg = (key: string, value?: unknown) => {
        splat.push(`-${key}`);

        if (value) {
            splat.push(value);
        }
    };

    let argz: unknown[] = [];
    if (object.arguments && Array.isArray(object.arguments)) {
        argz = object.arguments;
    } else if (options.arguments?.length) {
        argz.length = options.arguments.length;
    }

    if (options?.command?.length) {
        splat.push(...options.command);
    }

    for (let [key, value] of Object.entries(object)) {
        let pushArguments = makeArguments;

        if (options.arguments?.length && options.arguments.includes(key)) {
            // ensure the order of the arguments
            const index = options.arguments.indexOf(key);
            if (value) {
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
            pushArguments(key, "");
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
                } else {
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

    return splat;
}
