import { CaseInsensitiveMap } from "../collections/case_insensitive_map.ts";
import { IConfigBuilder, IConfigProvider, IConfigRoot, IConfigSource } from "./interfaces.ts";
import { ConfigRoot } from "./sections.ts";

export class ConfigBuilder implements IConfigBuilder
{
    #properties: Map<string, unknown>;
    #sources: IConfigSource[];

    constructor()
    {
        this.#sources = [];
        this.#properties = new CaseInsensitiveMap<unknown>();
    }
    
    get properties(): Map<string, unknown>
    {
        return this.#properties;
    }

    get sources(): IConfigSource[]
    {
        return this.#sources;
    }

    add(source: IConfigSource): IConfigBuilder {
        this.#sources.push(source);
        return this;
    }

    setBasePath(path: string): IConfigBuilder {
        this.#properties.set("basepath", path);
        return this;
    }

    build(): IConfigRoot
    {
        const providers : IConfigProvider[] = [];
        for(const source of this.sources)
        {
            const provider = source.build(this);
            providers.push(provider);
        }

        return new ConfigRoot(providers);
    }
}
