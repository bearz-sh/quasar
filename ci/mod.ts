import { ICiEnvProvider } from "./base.ts";

export class CiProvider implements ICiEnvProvider {
    #providers: ICiEnvProvider[];
    #provider?: ICiEnvProvider;

    constructor() {
        this.#providers = [];
    }


    get provider(): ICiEnvProvider {
        if (this.#provider) {
            return this.#provider;
        }

        this.#provider = this.#providers.find(p => p.isCi);
        if (!this.#provider) {
            throw new Error("No CI provider found");
        }

        return this.#provider;
    }

    get isCi(): boolean {
        return this.provider.isCi;
    }

    get name(): string {
        return this.provider.name;
    }

    get buildNumber(): string {
        return this.provider.buildNumber;
    }

    get refName(): string {
        return this.provider.refName;
    }

    get ref(): string {
        return this.provider.ref;
    }

    get sha(): string {
        return this.provider.sha;
    }

    add(provider: ICiEnvProvider) {
        if (!this.#providers.includes(provider)) {
            this.#providers.push(provider);
        }

        return this;
    }
}