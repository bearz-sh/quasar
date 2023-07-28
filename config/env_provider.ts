import { CaseInsensitiveMap } from "../collections/case_insensitive_map.ts";
import { IConfigBuilder, IConfigProvider, IConfigSource } from "./interfaces.ts";
import { ConfigProvider } from "./provider.ts";
import { toObject } from "../os/env.ts";
import { configPath } from "./sections.ts";

export interface IEnvSourceArgs {
    prefix?: string;
    sepatator?: string;
}

export class EnvSource implements IConfigSource {
    constructor(args?: Partial<IEnvSourceArgs>) {
        this.prefix = args?.prefix ?? "APP_";
        this.separator = args?.sepatator ?? "_";
    }

    prefix: string;

    separator: string;

    build(_builder: IConfigBuilder): IConfigProvider {
        return new EnvProvider(this);
    }
}

export class EnvProvider extends ConfigProvider {
    #prefix: string;
    #separator: string;

    constructor(source: EnvSource) {
        super();
        this.#prefix = source.prefix;
        this.#separator = source.separator;
    }

    override load(): void {
        const env = toObject();
        const data = new CaseInsensitiveMap<string>();
        for (const key of Object.keys(env)) {
            const value = env[key];
            if (value === undefined || value === null) {
                continue;
            }

            let name = key;
            if (this.#prefix.length > 0) {
                if (!key.startsWith(this.#prefix)) {
                    continue;
                }

                name = key.substring(this.#prefix.length).replaceAll(this.#separator, configPath.separator);
                if (name.length === 0) {
                    continue;
                }

                data.set(name, value);
                continue;
            }

            name = key.replaceAll(this.#separator, configPath.separator);
            if (name.length === 0) {
                continue;
            }

            data.set(name, value);
        }

        this.data = data;
    }
}
