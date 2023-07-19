import { printf } from "https://deno.land/std@0.194.0/fmt/printf.ts";
import { readTextFileSync, writeTextFileSync } from "../../fs/fs.ts";
import { existsSync } from "../../fs/mod.ts";
import * as env from "../../os/env.ts";
import { cwd } from "../../process/_base.ts";
import { CiHost, ICiEnvProvider, ICiHost } from "../base.ts";

export class GitLabEnvProvider implements ICiEnvProvider {
    #isCi?: boolean;
    #repo?: string;

    get name(): string {
        return "gitlab";
    }
    
    get isCi(): boolean {
        if (this.#isCi === undefined) {
            this.#isCi = env.get("GITHUB_ACTIONS") === "true";
        }
        
        return this.#isCi;
    }

    get workingDirectory(): string {
        return env.get("CI_PROJECT_DIR") || "";
    }

    get repo(): string {
        return env.get("CI_PROJECT_URL") || "";
    }

    get buildNumber(): string {
        return env.get("CI_PIPELINE_ID") || "";
    }

    get refName() : string {
        return env.get("CI_COMMIT_REF_NAME") || "";
    }

    get ref(): string {
        return env.get("CI_COMMIT_REF_SLUG") || "";
    }

    get sha(): string {
        return env.get("CI_COMMIT_SHA") || "";
    }
}

export class GitLabCiHost extends CiHost
{
    override startGroup(name: string): CiHost {
        const title = name;
        name = name.replace(/[^a-zA-Z0-9_]/g, "_");
        this.groups.push(name);
        
        printf(`\e[0Ksection_start:${Math.round((new Date()).getTime() / 1000)}:${name}\r\e[0K${title}\n`);
        return this;
    }

    override endGroup(): CiHost {
        printf(`\e[0Ksection_end:${Math.round((new Date()).getTime() / 1000)}:${this.groups.pop()}\r\e[0K\n`);
        return this;
    }

    override exportVariable(name: string, value: string, secret = false): ICiHost {
        const file = env.get("GITLAB_ENV") || `${cwd()}/.gitlab.env`;
        let content = "";
        if (existsSync(file)) {
            content = readTextFileSync(file);
        }
       
        writeTextFileSync(file, `${content}\n${name}="${value}"`);
        

        return super.exportVariable(name, value, secret);
    }
}