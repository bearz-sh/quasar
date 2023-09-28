export const ERR = Symbol("ERR");
export const OK = Symbol("OK");

export class Result<T, E> {
    #ok: T | undefined;
    #error: E | undefined;
    #symbol: symbol;

    constructor(ok: T | undefined, error: E | undefined, symbol: typeof OK | typeof ERR = OK) {
        this.#ok = ok;
        this.#error = error;
        this.#symbol = symbol;
    }

    get isOk(): boolean {
        return this.#symbol === OK;
    }

    get isErr(): boolean {
        return this.#symbol === ERR;
    }

    isOkAnd(predicate: (value: T) => boolean): boolean {
        return this.isOk && predicate(this.#ok!);
    }

    isErrAnd(predicate: (value: E) => boolean): boolean {
        return this.isErr && predicate(this.#error!);
    }

    map<U>(fn: (value: T) => U): Result<U, E> {
        if (this.#ok == undefined) {
            return new Result<U, E>(undefined, this.#error);
        }
        return new Result<U, E>(fn(this.#ok), undefined);
    }

    mapErr<U>(fn: (value: E) => U): Result<T, U> {
        if (this.#error == undefined) {
            return new Result<T, U>(this.#ok, undefined);
        }
        return new Result<T, U>(undefined, fn(this.#error));
    }

    unwrap(): T {
        if (this.#ok == undefined) {
            throw new Error("Result is error");
        }
        return this.#ok;
    }

    unwrapError(): E {
        if (this.#error == undefined) {
            throw new Error("Result is ok");
        }
        return this.#error;
    }

    unwrapOr(def: T): T {
        if (this.#ok == undefined) {
            return def;
        }
        return this.#ok;
    }
}

export function ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined, OK);
}

export function err<T, E>(value: E): Result<T, E> {
    return new Result<T, E>(undefined, value, ERR);
}
