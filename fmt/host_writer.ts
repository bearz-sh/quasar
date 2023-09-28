import { get, has, set } from "../os/env.ts";
import { ISupportsColor, supportsColor } from "./supports_color.ts";
import { args, isatty, stdout } from "../process/_base.ts";
import { blue, cyan, gray, green, magenta, red, sprintf, yellow } from "../deps.ts";
import { secretMasker } from "../secrets/masker.ts";

function handleStack(stack?: string) {
    stack = stack ?? "";
    const index = stack.indexOf("\n");
    if (index === -1) {
        return stack;
    }

    return stack.substring(index + 1);
}

export function handleArguments(args: IArguments) {
    let msg: string | undefined = undefined;
    let stack: string | undefined = undefined;

    switch (args.length) {
        case 0:
            return { msg, stack };
        case 1:
            {
                if (args[0] instanceof Error) {
                    const e = args[0] as Error;
                    msg = e.message;
                    stack = handleStack(e.stack);
                } else {
                    msg = args[0] as string;
                }

                return { msg, stack };
            }

        case 2:
            {
                if (args[0] instanceof Error) {
                    const e = args[0] as Error;
                    const message = args[1] as string;
                    msg = message;
                    stack = handleStack(e.stack);
                } else {
                    const message = args[0] as string;
                    const splat = Array.from(args).slice(1);
                    msg = sprintf(message, ...splat);
                }
                return { msg, stack };
            }

        default:
            {
                if (args[0] instanceof Error) {
                    const e = args[0] as Error;
                    const message = args[1] as string;
                    const splat = Array.from(args).slice(2);
                    msg = sprintf(message, ...splat);
                    stack = handleStack(e.stack);
                } else {
                    const message = args[0] as string;
                    const splat = Array.from(args).slice(1);
                    msg = sprintf(message, ...splat);
                }

                return { msg, stack };
            }
    }
}

export enum WriteLevel {
    None = 0,
    Critical = 10,
    Error = 20,
    Warning = 30,
    Command = 35,
    Info = 40,
    Debug = 50,
    Trace = 60,
}

export interface IHostWriter {
    readonly interactive: boolean;

    readonly supportsColor: ISupportsColor;

    enabled(level: WriteLevel): boolean;

    startGroup(name: string): IHostWriter;

    endGroup(): IHostWriter;

    success(message: string, ...args: unknown[]): IHostWriter;

    progress(name: string, value: number): IHostWriter;

    command(message: string, ...args: unknown[]): IHostWriter;

    debug(message: string, ...args: unknown[]): IHostWriter;

    trace(message: string, ...args: unknown[]): IHostWriter;

    info(message: string, ...args: unknown[]): IHostWriter;

    error(e: Error, message?: string, ...args: unknown[]): IHostWriter;
    error(message: string, ...args: unknown[]): IHostWriter;

    warn(e: Error, message?: string, ...args: unknown[]): IHostWriter;
    warn(message: string, ...args: unknown[]): IHostWriter;

    write(message?: string, ...args: unknown[]): IHostWriter;

    writeLine(message?: string, ...args: unknown[]): IHostWriter;

    exportVariable(name: string, value: string, secret: boolean): IHostWriter;
}

export class HostWriter implements IHostWriter {
    #interactive?: boolean;
    #level: WriteLevel;

    constructor(level?: WriteLevel) {
        this.#level = level ?? WriteLevel.Debug;
    }

    get level(): WriteLevel {
        return this.#level;
    }

    enabled(level: WriteLevel): boolean {
        return this.#level >= level;
    }

    get interactive(): boolean {
        if (this.#interactive !== undefined) {
            return this.#interactive;
        }

        if (get("CI") === "true") {
            this.#interactive = false;
            return false;
        }

        const isCi = [
            "CI",
            "GITHUB_ACTIONS",
            "GITLAB_CI",
            "CIRCLECI",
            "BITBUCKET_BUILD_NUMBER",
            "TF_BUILD",
            "JENKINS_URL",
        ].some((o) => has(o));

        if (isCi) {
            this.#interactive = false;
            return false;
        }

        if (get("DEBIAN_FRONTEND") === "noninteractive") {
            this.#interactive = false;
        }

        if (args.includes("-NonInteractive") || args.includes("--non-interactive")) {
            this.#interactive = false;
        }

        this.#interactive = isatty(stdout.rid);
        return this.#interactive;
    }

    get supportsColor(): ISupportsColor {
        return supportsColor;
    }

    progress(name: string, value: number): IHostWriter {
        this.write(`${name}: ${value.toString().padStart(2)}% \r`);
        return this;
    }

    command(message: string, args: unknown[]): IHostWriter {
        if (this.#level < WriteLevel.Command) {
            return this;
        }
        const splat = secretMasker.mask(args.join(" "));
        const fmt = `$ ${message} ${splat}`;
        if (this.supportsColor.stdout.level) {
            this.writeLine(cyan(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    exportVariable(name: string, value: string, secret = false): IHostWriter {
        set(name, value, secret);
        return this;
    }

    trace(message: string, ...args: unknown[]): IHostWriter {
        if (this.#level > WriteLevel.Debug) {
            return this;
        }

        const fmt = `TRC: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.supportsColor.stdout.level) {
            this.writeLine(gray(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    debug(message: string, ...args: unknown[]): IHostWriter {
        if (this.#level < WriteLevel.Debug) {
            return this;
        }

        const fmt = `DBG: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.supportsColor.stdout.level) {
            this.writeLine(gray(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    warn(e: Error, message?: string, ...args: unknown[]): IHostWriter;
    warn(message: string, ...args: unknown[]): IHostWriter;
    warn(): IHostWriter {
        if (this.#level < WriteLevel.Warning) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        const fmt = `WRN: ${msg}`;

        if (this.supportsColor.stdout.level) {
            this.writeLine(yellow(fmt));
            if (stack) {
                this.writeLine(yellow(stack));
            }
            return this;
        }

        this.writeLine(fmt);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    }

    error(e: Error, message?: string, ...args: unknown[]): IHostWriter;
    error(message: string, ...args: unknown[]): IHostWriter;
    error(): IHostWriter {
        if (this.#level < WriteLevel.Error) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        const fmt = `ERR: ${msg}`;

        if (this.supportsColor.stdout.level) {
            this.writeLine(red(fmt));
            if (stack) {
                this.writeLine(red(stack));
            }
            return this;
        }

        this.writeLine(fmt);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    }

    success(message: string, ...args: unknown[]): IHostWriter {
        switch (arguments.length) {
            case 0:
                return this;

            case 1:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(green(`${message}`));
                    } else {
                        this.writeLine(`${message}`);
                    }
                }
                return this;

            default: {
                if (this.supportsColor.stdout.level) {
                    this.writeLine(green(`${sprintf(message, ...args)}`));
                } else {
                    this.writeLine(`${sprintf(message, ...args)}`);
                }

                return this;
            }
        }
    }

    info(message: string, ...args: unknown[]): IHostWriter {
        if (this.#level < WriteLevel.Info) {
            return this;
        }
        const fmt = `INF: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.supportsColor.stdout.level) {
            this.writeLine(blue(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    write(message?: string, ...args: unknown[]): IHostWriter {
        if (message === undefined) {
            return this;
        }

        switch (arguments.length) {
            case 0:
                return this;

            case 1:
                stdout.writeSync(new TextEncoder().encode(message));
                break;

            default:
                {
                    const formatted = sprintf(message, ...args);
                    stdout.writeSync(new TextEncoder().encode(formatted));
                }

                break;
        }

        return this;
    }

    writeLine(message?: string, ...args: unknown[]): IHostWriter {
        switch (arguments.length) {
            case 0:
                stdout.writeSync(new TextEncoder().encode("\n"));
                break;

            case 1:
                stdout.writeSync(new TextEncoder().encode(`${message}\n`));
                break;

            default:
                {
                    const formatted = sprintf(`${message}\n`, ...args);
                    stdout.writeSync(new TextEncoder().encode(formatted));
                }

                break;
        }

        return this;
    }

    startGroup(name: string): IHostWriter {
        if (this.supportsColor.stdout.level) {
            this.writeLine(magenta(`> ${name}`));
        } else {
            this.writeLine(`> ${name}`);
        }

        return this;
    }

    endGroup(): IHostWriter {
        this.writeLine();
        return this;
    }
}

export const hostWriter = new HostWriter();
