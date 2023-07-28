import { get, has, set } from "../os/env.ts";
import { supportsColor, ISupportsColor } from "./supports_color.ts";
import { isatty, stdout, args } from "../process/_base.ts";
import { sprintf } from "https://deno.land/std/fmt/printf.ts";
import { blue, gray, green, magenta, red, yellow } from "../deps.ts";
import { cyan } from "https://deno.land/std@0.194.0/fmt/colors.ts";


function handleStack(stack?: string) {
    stack = stack ?? "";
    const index = stack.indexOf('\n');
    if (index === -1)
        return stack;

    return stack.substring(index + 1);
}

export interface IHostWriter {
    readonly interactive: boolean;

    readonly supportsColor: ISupportsColor;

    startGroup(name: string): IHostWriter;

    endGroup(): IHostWriter;

    success(message: string, ...args: unknown[]): IHostWriter;

    progress(name: string, value: number): IHostWriter;

    command(message: string,...args: unknown[]): IHostWriter;

    debug(message: string, ...args: unknown[]): IHostWriter;

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

    get interactive(): boolean {
        if (this.#interactive !== undefined) 
            return this.#interactive

       
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
            "JENKINS_URL"].some(o => has(o));

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
        return this.#interactive
    }

    get supportsColor(): ISupportsColor {
        return supportsColor;
    }

    progress(name: string, value: number): IHostWriter
    {
        this.write(`${name}: ${value.toString().padStart(2)}% \r`);
        return this;
    }

    command(message: string,...args: unknown[]): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;

            case 1:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(cyan(`$> ${message}`));
                    }
                    else {
                        this.writeLine(`$> ${message}`);
                    }
                }
                return this;

            default:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(cyan(`$>: ${sprintf(message, ...args)}`));
                    }
                    else {
                        this.writeLine(`$>: ${sprintf(message, ...args)}`);
                    }

                    return this;
                }
        }
    }

    exportVariable(name: string, value: string, secret = false): IHostWriter
    {
        set(name, value, secret);
        return this;
    }

    debug(message: string, ...args: unknown[]): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;

            case 1:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(gray(`DBG: ${message}`));
                    }
                    else {
                        this.writeLine(`DBG: ${message}`);
                    }
                }
                return this;

            default:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(gray(`DBG: ${sprintf(message, ...args)}`));
                    }
                    else {
                        this.writeLine(`DBG: ${sprintf(message, ...args)}`);
                    }

                    return this;
                }
        }
    }

    warn(e: Error, message?: string, ...args: unknown[]): IHostWriter
    warn(message: string, ...args: unknown[]): IHostWriter
    warn(): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;
            case 1:
                {
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(yellow(`WRN: ${e.message}`));
                            this.writeLine(yellow(handleStack(e.stack)));
                        } else {
                            this.writeLine(`WRN: ${e.message}`);
                            this.writeLine(handleStack(e.stack));
                        }
                        return this;
                    }

                    const message = arguments[0] as string;
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(yellow(`WRN: ${message}`));
                    } else {
                        this.writeLine(`WRN: ${message}`);
                    }

                    return this;
                }

            case 2:
                {
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        const message = arguments[1] as string;
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(yellow(`WRN: ${message}`));
                            this.writeLine(yellow(handleStack(e.stack)));
                        } else {
                            this.writeLine(`WRN: ${message}`);
                            this.writeLine(handleStack(e.stack));
                        }
                        return this;
                    }

                    const message = arguments[0] as string;
                    const args = Array.from(arguments).slice(1);
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(yellow(`WRN: ${sprintf(message, ...args)}`));
                    }
                    else {
                        this.writeLine(`WRN: ${sprintf(message, ...args)}`);
                    }

                    return this;
                }

            default:
                {
                   
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        const message = arguments[1] as string;
                        const args = Array.from(arguments).slice(2);
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(yellow(`WRN: ${sprintf(message, ...args)}`));
                            this.writeLine(yellow(handleStack(e.stack)));
                        } else {
                            this.writeLine(`WRN: ${sprintf(message, ...args)}`);
                            this.writeLine(handleStack(e.stack));
                        }
                    }
                    else 
                    {
                        const message = arguments[0] as string;
                        const args = Array.from(arguments).slice(1);
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(yellow(`WRN: ${sprintf(message, ...args)}`));
                        } else {
                            this.writeLine(`WRN: ${sprintf(message, ...args)}`);
                        }
                    }
                    return this;
                }
        }
    }


    error(e: Error, message?: string, ...args: unknown[]): IHostWriter
    error(message: string, ...args: unknown[]): IHostWriter
    error(): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;
            case 1:
                {
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(red(`ERR: ${e.message}`));
                            this.writeLine(red(handleStack(e.stack)));
                        } else {
                            this.writeLine(`ERR: ${e.message}`);
                            this.writeLine(handleStack(e.stack));
                        }
                        return this;
                    }

                    const message = arguments[0] as string;
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(red(`ERR: ${message}`));
                    } else {
                        this.writeLine(`ERR: ${message}`);
                    }

                    return this;
                }

            case 2:
                {
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        const message = arguments[1] as string;
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(red(`ERR: ${message}`));
                            this.writeLine(red(handleStack(e.stack)));
                        } else {
                            this.writeLine(`ERR: ${message}`);
                            this.writeLine(handleStack(e.stack));
                        }
                        return this;
                    }

                    const message = arguments[0] as string;
                    const args = arguments[1] as unknown;
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(red(`ERR: ${sprintf(message, args)}`));
                    }
                    else {
                        this.writeLine(`ERR: ${sprintf(message, args)}`);
                    }

                    return this;
                }

            default:
                {
                   
                    if (arguments[0] instanceof Error)
                    {
                        const e = arguments[0] as Error;
                        const message = arguments[1] as string;
                        const args = Array.from(arguments).slice(2);
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(red(`ERR: ${sprintf(message, ...args)}`));
                            this.writeLine(red(handleStack(e.stack)));
                        } else {
                            this.writeLine(`ERR: ${sprintf(message, ...args)}`);
                            this.writeLine(handleStack(e.stack));
                        }
                    }
                    else 
                    {
                        const message = arguments[0] as string;
                        const args = Array.from(arguments).slice(1);
                        if (this.supportsColor.stdout.level) {
                            this.writeLine(red(`ERR: ${sprintf(message, ...args)}`));
                        } else {
                            this.writeLine(`ERR: ${sprintf(message, ...args)}`);
                        }
                    }

                    return this;
                    
                }
        }
    }

    success(message: string, ...args: unknown[]): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;

            case 1:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(green(`${message}`));
                    }
                    else {
                        this.writeLine(`${message}`);
                    }
                }
                return this;

            default:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(green(`${sprintf(message, ...args)}`));
                    }
                    else {
                        this.writeLine(`${sprintf(message, ...args)}`);
                    }

                    return this;
                }
        }
    }

    info(message: string, ...args: unknown[]): IHostWriter
    {
        switch(arguments.length)
        {
            case 0:
                return this;

            case 1:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(blue(`INF: ${message}`));
                    }
                    else {
                        this.writeLine(`INF: ${message}`);
                    }
                }
                return this;

            default:
                {
                    if (this.supportsColor.stdout.level) {
                        this.writeLine(blue(`INF: ${sprintf(message, ...args)}`));
                    }
                    else {
                        this.writeLine(`INF: ${sprintf(message, ...args)}`);
                    }

                    return this;
                }
        }
    }

    write(message?: string, ...args: unknown[]): IHostWriter {
        if (message === undefined) {
            return this;
        }

        switch(arguments.length) {
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
        switch(arguments.length) {
            case 0:
                stdout.writeSync(new TextEncoder().encode('\n'));
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

    startGroup(name: string): IHostWriter
    {
        if (this.supportsColor.stdout.level) {
            this.writeLine(magenta(`> ${name}`));
        } else {
            this.writeLine(`> ${name}`);
        }

        return this;
    }

    endGroup(): IHostWriter
    {
        this.writeLine();
        return this;
    }
}