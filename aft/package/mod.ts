import { readTextFile, readTextFileSync } from "../../mod.ts";
import { dirname, join } from "../../path/mod.ts";
import { IAftPackage, IAftSpec } from "./interfaces.ts";
import { parseYaml } from "../../deps.ts";

export class AftPackage implements IAftPackage 
{
    readonly file: string;
    readonly spec: IAftSpec;
    readonly secretsFile: string;
    readonly valuesFile: string;
    readonly composeFile: string;

    constructor(file: string, spec: IAftSpec)
    {
        this.file = file;
        this.spec = spec;
        const dir = dirname(file);
        this.secretsFile = join(dir, "secrets.yaml");
        this.valuesFile = join(dir, "values.yaml");
        this.composeFile = join(dir, "compose.yaml.hbs");
    }

    static async load(file: string): Promise<IAftPackage> {
        let dir = file;
        if (file.endsWith(".yaml")) {
            dir = dirname(file);
        } else {
            file = join(dir, "aft.yaml");
        }

        const content = await readTextFile(file);
        const spec = parseYaml(content) as IAftSpec;

        return new AftPackage(file, spec);
    }

    static loadSync(file: string): IAftPackage {
        let dir = file;
        if (file.endsWith(".yaml")) {
            dir = dirname(file);
        } else {
            file = join(dir, "aft.yaml");
        }

        const content = readTextFileSync(file);
        const spec = parseYaml(content) as IAftSpec;

        return new AftPackage(file, spec);
    }
}