import { equalsIgnoreCase } from "../text/str.ts";

export class CaseInsensitiveMap<V> extends Map<string, V> {
    override get(key: string): V | undefined {
        const v = super.get(key);
        if (v !== undefined) {
            return v;
        }

        for (const k of this.keys()) {
            if (k.length === key.length && equalsIgnoreCase(k, key)) {
                return super.get(k);
            }
        }

        return undefined;
    }

    override has(key: string): boolean {
        if (super.has(key)) {
            return true;
        }

        for (const k of this.keys()) {
            if (k.length === key.length && equalsIgnoreCase(k, key)) {
                return true;
            }
        }

        return false;
    }

    override set(key: string, value: V): this {
        if (super.has(key)) {
            super.set(key, value);
            return this;
        }

        for (const k of this.keys()) {
            if (k.length === key.length && equalsIgnoreCase(k, key)) {
                super.set(k, value);
                return this;
            }
        }

        super.set(key, value);
        return this;
    }

    override delete(key: string): boolean {
        if (super.delete(key)) {
            return true;
        }

        for (const k of this.keys()) {
            if (k.length === key.length && equalsIgnoreCase(k, key)) {
                super.delete(k);
                return true;
            }
        }

        return false;
    }
}
