export interface IAftPackage {
    file: string;
    spec: IAftSpec;
    secretsFile: string;
    valuesFile: string;
    composeFile: string;
}

export interface IAftSpec extends Record<string, unknown> {
    name: string
    description: string
    authors?: string[]
    service?: string
    version: string
    image: { name: string, tag: string } 
}