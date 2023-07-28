// implement an option type

export class Option<T> {
    #value: T | undefined;

    constructor(value: T | undefined) {
        this.#value = value;
    }

    get isSome(): boolean {
        return this.#value != undefined;
    }

    get isNone(): boolean {
        return this.#value == undefined;
    }

    bind(fn: (value: T) => Option<T>): Option<T> {
        if (this.#value == undefined) {
            return new Option<T>(undefined);
        }
        return fn(this.#value);
    }

    map<U>(fn: (value: T) => U): Option<U> {
        if (this.#value == undefined) {
            return new Option<U>(undefined);
        }
        return new Option<U>(fn(this.#value));
    }

    unwrap(): T {
        if (this.#value == undefined) {
            throw new Error("Option is none");
        }
        return this.#value;
    }

    unwrapOr(defaultValue: T): T {
        if (this.#value == undefined) {
            return defaultValue;
        }
        return this.#value;
    }

    unwrapOrElse(fn: () => T): T {
        if (this.#value == undefined) {
            return fn();
        }
        return this.#value;
    }
}

export function some<T>(value: T): Option<T> {
    return new Option<T>(value);
}

export function none<T>(): Option<T> {
    return new Option<T>(undefined);
}
