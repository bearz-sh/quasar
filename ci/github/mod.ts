import { printf, sprintf } from "https://deno.land/std@0.194.0/fmt/printf.ts";
import * as env from "../../os/env.ts";
import { CiHost, ICiEnvProvider, ICiHost } from "../base.ts";
import { readTextFileSync, writeTextFileSync } from "../../fs/fs.ts";

export class GitHubEnvProvider implements ICiEnvProvider {
    #isCi?: boolean;
    #repo?: string;

    get name(): string {
        return "github";
    }

    get isCi(): boolean {
        if (this.#isCi === undefined) {
            this.#isCi = env.get("GITHUB_ACTIONS") === "true";
        }

        return this.#isCi;
    }

    get workingDirectory(): string {
        return env.get("GITHUB_WORKSPACE") || "";
    }

    get repo(): string {
        if (!this.#repo) {
            const server = env.get("GITHUB_SERVER_URL") || "https://github.com";
            const repo = env.get("GITHUB_REPOSTORY") || "";
            this.#repo = `${server}/${repo}`;
        }
        return this.#repo;
    }

    get buildNumber(): string {
        return env.get("GITHUB_RUN_ID") || "";
    }

    get refName(): string {
        return env.get("GITHUB_REFNAME") || "";
    }

    get ref(): string {
        return env.get("GITHUB_REF") || "";
    }

    get sha(): string {
        return env.get("GITHUB_SHA") || "";
    }
}

export class GitHubCiHost extends CiHost {
    override startGroup(name: string): CiHost {
        this.groups.push(name);
        printf(`::group::${name}\n`);
        return this;
    }

    override endGroup(): CiHost {
        printf(`::endgroup::\n`);
        return this;
    }

    override info(message: string, ...args: unknown[]): ICiHost {
        printf(`::notice::${sprintf(message, ...args)}\n`);
        return this;
    }

    override error(message: string, ...args: unknown[]): ICiHost {
        printf(`::error::${sprintf(message, ...args)}\n`);
        return this;
    }

    override warn(message: string, ...args: unknown[]): ICiHost {
        printf(`::warning::${sprintf(message, ...args)}\n`);
        return this;
    }

    override debug(message: string, ...args: unknown[]): ICiHost {
        printf(`::debug::${sprintf(message, ...args)}\n`);
        return this;
    }

    override exportVariable(name: string, value: string, secret = false): ICiHost {
        if (secret) {
            printf(`::add-mask::${value}\n`);
        }

        const file = env.get("GITHUB_ENV") || "";
        if (file.length === 0) {
            this.warn("GITHUB_ENV is not defined. Variable %s will not be exported.", name);
            return super.exportVariable(name, value, secret);
        }
        const content = readTextFileSync(file);
        writeTextFileSync(file, `${content}"\n${name}="${value}`);

        return super.exportVariable(name, value, secret);
    }
}
