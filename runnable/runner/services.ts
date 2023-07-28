import { IProcess } from "../interfaces.ts";
import { args, cwd, chdir, capture, run, IExecOptions, exec as exec2  } from '../../process/mod.ts'
import { isProcessElevated } from "../../os/os.ts";
import { ok, err } from "../../optional/result.ts";
import { IEnvSubstitutionOptions } from "../../os/env.ts";
import { IEnv, IEnvPath } from "../interfaces.ts";
import * as env from "../../os/env.ts";
import { secretMasker } from "../../secrets/mod.ts";
import { CaseInsensitiveMap } from "../../collections/case_insensitive_map.ts";
import { equalsIgnoreCase } from "../../str.ts";
import { IOperatingSystem } from '../interfaces.ts';

import { 
    IS_DARWIN,
    RUNTIME_ARCH, 
    IS_LINUX, 
    IS_WINDOWS, 
    NEW_LINE, 
    PATH_SEPARATOR,
    DIR_SEPARATOR,
    PATH_VAR_NAME as PATH
} from '../../os/constants.ts';

export { CaseInsensitiveMap }

export const os: IOperatingSystem = {
    arch: RUNTIME_ARCH,
    platform: Deno.build.os,
    directorySeparator: DIR_SEPARATOR,
    isDarwin: IS_DARWIN,
    isLinux: IS_LINUX,
    isWindows: IS_WINDOWS,
    newLine: NEW_LINE,
    pathSeparator: PATH_SEPARATOR
}




function findPathIndex(paths: string[], path: string): number {
    if (IS_WINDOWS) {
        return paths.findIndex(p => equalsIgnoreCase(p, path));
    }

    return paths.findIndex(p => p === path);
}

class EnvPath implements IEnvPath
{
    #env: IEnv;

    constructor(env: IEnv)
    {
        this.#env = env;
    }

    get(): string {
        return this.#env.get(PATH) || "";
    }

    set(path: string): void {
        this.#env.set(PATH, path);
    }

    add(value: string,prepend?: boolean|undefined): void {
        const paths = this.split();
        if (findPathIndex(paths, value) < 0) {
            return;
        }

        if (prepend) {
            paths.unshift(value);
        } else {
            paths.push(value);
        }

        this.set(paths.join(PATH_SEPARATOR));
    }

    remove(value: string): void {
        const paths = this.split();
        
        const index = findPathIndex(paths, value);
        if (index > -1) {
            paths.splice(index, 1);
            this.set(paths.join(PATH_SEPARATOR));
        }
    }
    has(value: string): boolean {
        return findPathIndex(this.split(), value) > -1;
    }

    split(): string[] {
        return this.get().split(PATH_SEPARATOR);
    }
}

/**
 * Implementation of IEnv that doesn't modify the process environment.
 * which will allow multiple jobs to run in parallel without interfering with each other.
 */
export class Env implements IEnv 
{
    #env: Map<string, string>;
    #path: IEnvPath;

    constructor()
    {
        this.#env = new CaseInsensitiveMap<string>();
        const data = env.toObject();
        for (const key of Object.keys(data)) {
            this.#env.set(key, data[key] as string);
        }

        if (IS_WINDOWS) {
            this.#env.set("HOME", env.get("USERPROFILE") || "");
            this.#env.set("HOSTNAME", env.get("COMPUTERNAME") || "");
            this.#env.set("USER", env.get("USERNAME") || "");
        }

        this.#path = new EnvPath(this);
    }

    get path(): IEnvPath {
        return this.#path;
    }

    expand(template: string,options?: IEnvSubstitutionOptions): string {
        options = options || {};
        options.getVariable = (name: string) => this.get(name);
        return env.expand(template,options);
    }

    get(name: string): string|undefined {
        return this.#env.get(name);
    }

    getOrDefault(key: string,defaultValue: string): string {
        return this.get(key) || defaultValue;
    }

    getRequired(name: string): string {
        const v = this.get(name);
        if (v === undefined)
        {
            throw new Error(`Environment variable '${name}' is not defined`);
        }

        return v;
    }

    set(key: string,value: string): void;
    set(key: string,value: string,isSecret: boolean): void;
    set(map: { [key: string]: string; }): void;
    set(): void {
        switch(arguments.length) {
            case 1:
                {
                    const map = arguments[0] as { [key: string] : string };
                    for (const key in map)
                    {
                        const value = map[key];
                        this.#env.set(key, value);
                    }
                }
            
                break;
    
            case 2:
                {
                    const key = arguments[0] as string;
                    const value = arguments[1] as string;
                    this.#env.set(key, value);
                }
    
                break;
    
            case 3:
                {
                    const key = arguments[0] as string;
                    const value = arguments[1] as string;
                    const isSecret = arguments[2] as boolean;
                    if (isSecret) {
                        secrets.set(key, value);
                        secretMasker.add(value);
                    }
    
                    this.#env.set(key, value);
                }
    
                break;
    
            default:
                throw new Error("Invalid number of arguments.");
        }
    }

    remove(name: string): void {
        this.#env.delete(name);
    }

    has(name: string): boolean {
        return this.#env.has(name);
    }

    toObject(): Record<string,string|undefined> {
        const result: Record<string,string|undefined> = {};
        for (const [key,value] of this.#env){
            result[key] = value;
        }

        return result;
    }    
}

const defaultCwd = cwd();
const cwdHistory: string[] = [];

export const ps: IProcess = {
    args: args,
    cwd: "", 
    isElevated: isProcessElevated(),
    push(path: string) {
        cwdHistory.push(cwd());
        chdir(path);
    },
    pop() {
        const last = cwdHistory.pop() || defaultCwd;
        chdir(last);
        return last;
    },
    async capture(...args: string[]) {
        try {
            const result = await capture(...args);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    },
    async run(...args: string[]) {
        try {
            const result = await run(...args);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    },

    async exec(exec: string, args?: string[], options?: IExecOptions) {
        try {
            const result = await exec2(exec, args, options);
            return ok(result)
        } catch (error) {
            return err(error);
        }
    }
}

Reflect.defineProperty(ps, "cwd", {
    get: () => cwd(),
    set: (value: string) => chdir(value),
    enumerable: true,
    configurable: true
});


export const secrets = new CaseInsensitiveMap<string>();