import { printf } from "https://deno.land/std@0.194.0/fmt/printf.ts";
import * as env from "../../os/env.ts";
import { CiHost, ICiEnvProvider, ICiHost } from "../base.ts";

export class AzDoEnvProvider implements ICiEnvProvider {
    #isCi?: boolean;

    get name(): string {
        return "azdo";
    }
    
    get isCi(): boolean {
        if (this.#isCi === undefined) {
            this.#isCi = env.get("TF_BUILD") === "true";
        }
        
        return this.#isCi;
    }

    get artifactsDir(): string {
        return env.get("BUILD_ARTIFACTSTAGINGDIRECTORY") || "";
    }

    get repo(): string {
        return env.get("BUILD_REPOSITORY_URI") || "";
    }

    get workingDirectory(): string {
        return  env.get("BUILD_REPOSITORY_LOCALPATH") || env.get("SYSTEM_DEFAULTWORKINGDIRECTORY") || "";
    }

    get buildNumber(): string {
        return env.get("BUILD_BUILDNUMBER") || "";
    }

    get refName() : string {
        return env.get("BUILD_SOURCEBRANCH") || "";
    }

    get ref(): string {
        return env.get("BUILD_SOURCEBRANCHNAME") || "";
    }

    get sha(): string {
        return env.get("BUILD_SOURCEVERSION") || "";
    }
}

export class AzDoCiHost extends CiHost {
    constructor() {
        super();
    }

    override startGroup(name: string): ICiHost {
        this.groups.push(name);
        printf(`##[group]${name}\n`);
        return this;
    }

    override endGroup(): ICiHost {
        this.groups.pop();
        printf(`##[endgroup]\n`);
        return this;
    }

    override warn(message: string, ...args: unknown[]): ICiHost {
        printf(`##[warning]${message}\n`, ...args);
        return this;
    }

    override error(message: string, ...args: unknown[]): ICiHost {
        printf(`##[error]${message}\n`, ...args);
        return this;
    }

    override debug(message: string, ...args: unknown[]): ICiHost {
        printf(`##[debug]${message}\n`, ...args);
        return this;
    }

    override command(message: string, ...args: unknown[]): ICiHost {
        printf(`##[command]${message}\n`, ...args);
        return this;
    }

    override exportVariable(name: string, value: string, secret = false): ICiHost {
        printf(`##[setvariable variable=${name};isSecret=${secret};]${value}\n`);
        return super.exportVariable(name, value, secret);
    }
}