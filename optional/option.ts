// implement an option type

export const SOME = Symbol("SOME");
export const NONE = Symbol("NONE");

export class Option<T> {
    #value: T | undefined;
    #symbol: symbol;

    constructor(value: T | undefined, symbol: typeof SOME | typeof NONE = SOME) {
        this.#value = value;
        this.#symbol = symbol;
    }

    get isSome(): boolean {
        return this.#symbol === SOME;
    }

    get isNone(): boolean {
        return this.#symbol === NONE;
    }

    bind(fn: (value: T) => Option<T>): Option<T> {
        if (this.isNone) {
            return new Option<T>(undefined, NONE);
        }
        return fn(this.#value!);
    }

    map<U>(fn: (value: T) => U): Option<U> {
        if (this.isNone) {
            return new Option<U>(undefined, NONE);
        }
        return new Option<U>(fn(this.#value!), SOME);
    }

    unwrap(): T {
        if (this.isNone) {
            throw new Error("Option is none");
        }

        return this.#value!;
    }

    unwrapOr(defaultValue: T): T {
        if (this.isNone) {
            return defaultValue;
        }

        return this.#value!;
    }

    unwrapOrElse(fn: () => T): T {
        if (this.isNone) {
            return fn();
        }
        return this.#value!;
    }
}

export function some<T>(value: T): Option<T> {
    return new Option<T>(value, SOME);
}

export function none<T>(): Option<T> {
    return new Option<T>(undefined, NONE);
}
