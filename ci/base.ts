import * as env from "../os/env.ts";
import { secretMasker } from '../secrets/masker.ts';
import { red, blue, gray, yellow, magenta  } from 'https://deno.land/std@0.194.0/fmt/colors.ts';
import { printf, sprintf  } from 'https://deno.land/std@0.194.0/fmt/printf.ts';


export interface ICiEnvProvider {
    isCi: boolean;

    name: string;

    buildNumber: string;

    refName: string;

    ref: string;

    sha: string;
}

export interface ICiHost {

    startGroup(name: string): ICiHost;

    endGroup(): ICiHost;

    command(message: string,...args: unknown[]): ICiHost

    debug(message: string, ...args: unknown[]): ICiHost;

    info(message: string, ...args: unknown[]): ICiHost;

    error(message: string, ...args: unknown[]): ICiHost;

    warn(message: string, ...args: unknown[]): ICiHost;

    writeLine(message: string, ...args: unknown[]): ICiHost;

    exportVariable(name: string, value: string, secret: boolean): ICiHost;
}

export class CiHost implements ICiHost {
    #groups: string[];

    constructor() {
        this.#groups = [];
    }

    get groups(): string[] {
        return this.#groups;
    }

    startGroup(name: string): ICiHost {
        this.#groups.push(name);
        this.writeLine("");
        this.writeLine(`::group::${name}`)
        return this;
    }
    
    endGroup(): ICiHost {
        this.#groups.pop();
        this.writeLine(`::endgroup::`)
        this.writeLine("");
        return this;
    }

    command(message: string,...args: unknown[]): ICiHost {
        const cmd = secretMasker.mask(sprintf(message, ...args));
        printf(magenta(`$ ${cmd}\n`));

        return this;
    }

    debug(message: string,...args: unknown[]): ICiHost {
        printf(gray(`[DEBUG] ${message}\n`), ...args);
        return this;
    }

    info(message: string,...args: unknown[]): ICiHost {
        printf(blue(`[INFO]  ${message}\n`), ...args);
        return this;
    }

    error(message: string,...args: unknown[]): ICiHost {
        printf(red(`[ERROR] ${message}\n`), ...args);
        return this;
    }
    
    warn(message: string,...args: unknown[]): ICiHost {
        printf(yellow(`[WARN]  ${message}\n`), ...args);
        return this;
    }

    writeLine(message: string,...args: unknown[]): ICiHost {
        printf(message + "\n", ...args);
        return this;
    }

    exportVariable(name: string,value: string,secret: boolean): ICiHost {
        if (secret) {
            secretMasker.add(value);
        }

        env.set(name, value);
        return this;
    }
}