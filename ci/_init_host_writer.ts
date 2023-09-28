export * from "./constants.ts";
import { get, set } from "../os/env.ts";
import { handleArguments, hostWriter, IHostWriter, WriteLevel } from "../fmt/host_writer.ts";
import { isGithub, isTfBuild } from "./constants.ts";
import { writeTextFileSync } from "../fs/fs.ts";
import { sprintf } from "../deps.ts";

// TODO: parse stack trace and apply to line and column for warning and error
if (isTfBuild) {
    hostWriter.startGroup = function (name: string): IHostWriter {
        this.writeLine(`##[group]${name}`);
        return this;
    };

    hostWriter.endGroup = function (): IHostWriter {
        this.writeLine("##[endgroup]");
        return this;
    };

    hostWriter.exportVariable = function (name: string, value: string, secret?: boolean): IHostWriter {
        set(name, value, secret ?? false);
        if (secret) {
            this.writeLine(`##[setVariable variable=${name};isSecret=true]${value}`);
            return this;
        }

        this.writeLine(`##[setVariable variable=${name}]${value}`);
        return this;
    };

    hostWriter.warn = function (): IHostWriter {
        if (this.level < WriteLevel.Warning) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        this.writeLine(`##[warning]${msg}`);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    };

    hostWriter.error = function (): IHostWriter {
        if (this.level < WriteLevel.Error) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        this.writeLine(`##[error]${msg}`);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    };

    hostWriter.debug = function (message: string, ...args: unknown[]): IHostWriter {
        if (this.level < WriteLevel.Debug) {
            return this;
        }

        if (args?.length > 0) {
            message = sprintf(message, ...args);
        }
        this.writeLine(`##[debug]${message}`);
        return this;
    };

    hostWriter.command = function (command: string, args?: unknown[]): IHostWriter {
        if (this.level < WriteLevel.Command) {
            return this;
        }

        this.writeLine(`##[command]${command} ${args?.join(" ")}`);
        return this;
    };
}

if (isGithub) {
    hostWriter.startGroup = function (name: string): IHostWriter {
        this.writeLine(`::group::${name}`);
        return this;
    };

    hostWriter.endGroup = function (): IHostWriter {
        this.writeLine(`::endgroup::`);
        return this;
    };

    hostWriter.exportVariable = function (name: string, value: string, secret?: boolean): IHostWriter {
        set(name, value, secret ?? false);
        if (secret) {
            this.writeLine(`::add-mask::${value}`);
            return this;
        }

        const file = get("GITHUB_ENV");
        if (file) {
            if (value.includes("\n")) {
                writeTextFileSync(file, `${name}<<EOF\n${value}\nEOF\n`, { append: true });
            } else {
                writeTextFileSync(file, `${name}=\"${value}\"\n`, { append: true });
            }
        }

        return this;
    };

    hostWriter.warn = function (): IHostWriter {
        if (this.level < WriteLevel.Warning) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        this.writeLine(`::warning::${msg}`);
        if (stack) {
            this.writeLine(`::warning::${stack}`);
        }

        return this;
    };

    hostWriter.error = function (): IHostWriter {
        if (this.level < WriteLevel.Error) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        this.writeLine(`::error::${msg}`);
        if (stack) {
            this.writeLine(`::error::${stack}`);
        }

        return this;
    };
}

export { hostWriter };
