import * as YAML from 'https://deno.land/std@0.194.0/yaml/mod.ts';


export class HbsModel
{
    #model: Record<string, unknown>;

    constructor(model?: Record<string, unknown>)
    {
        this.#model = model ?? {};
    }

    get<T>(key: string): T | undefined
    {
        if (!key.includes('.')) {
            return this.#model[key] as T;
        }

        let target = this.#model;
        const segments : string[] = [];
        key.split('.').forEach(x => {
            if (x.includes(']')) {
                const [p, i] = x.split('[');
                segments.push(p);
                segments.push(i.replace(']', ''));
                return;
            }

            segments.push(x);
        });

        const last = segments.pop() as string;

        for(const part of segments) {
            const next = target[part];
            if (next === undefined && next === null) {
                return undefined;
            }

            if(Array.isArray(next)) {
                target = next as unknown as Record<string, unknown>;
                continue;
            }

            if (typeof next !== 'object') {
                return undefined;
            }

            target = next as Record<string, unknown>;
        }

        return target[last] as T;
    }

    set<T>(key: string, value: T): HbsModel
    {
        if (!key.includes('.')) {
            this.#model[key] = value;
            return this;
        }

        let target = this.#model;
        const segments : string[] = [];
        key.split('.').forEach(x => {
            if (x.includes(']')) {
                const [p, i] = x.split('[');
                segments.push(p);
                segments.push(i.replace(']', ''));
                return;
            }

            segments.push(x);
        })

        const last = segments.pop() as string;

        for (const part of segments) {
            if (!target[part]) {
                target[part] = {};
            }

            target = target[part] as Record<string, unknown>;
        }

        target[last] = value;
        return this;
    }

    getOr<T>(key: string, def: T): T
    {
        const value = this.get<T>(key);
        if (value === undefined)
        {
            return def;
        }

        return value;
    }

    addJson(json: string): HbsModel
    {
        const obj = JSON.parse(json);
        this.#model = Object.assign(this.#model, obj);
        return this;
    }

    addJsonFile(file: string): HbsModel
    {
        const obj = JSON.parse(Deno.readTextFileSync(file));
        this.#model = Object.assign(this.#model, obj);
        return this;
    }

    addYaml(yaml: string): HbsModel
    {
        const obj = YAML.parse(yaml) as Record<string, unknown>;
        this.#model = Object.assign(this.#model, obj);
        return this;
    }

    addYamlFile(file: string): HbsModel
    {
        const obj = YAML.parse(Deno.readTextFileSync(file)) as Record<string, unknown>;
        this.#model = Object.assign(this.#model, obj);
        return this;
    }

    toObject(): Record<string, unknown>
    {
        return this.#model;
    }

}