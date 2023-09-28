export class ReadOnlyArray<T> extends Array<T> {
    constructor(...items: T[]) {
        super(...items);
    }

    override set length(value: number) {
        throw new Error("Cannot set length of readonly array");
    }

    override push(..._items: T[]): number {
        throw new Error("Cannot push to readonly array");
    }

    override pop(): T | undefined {
        throw new Error("Cannot pop from readonly array");
    }

    override shift(): T | undefined {
        throw new Error("Cannot shift from readonly array");
    }

    override unshift(..._items: T[]): number {
        throw new Error("Cannot unshift to readonly array");
    }

    override splice(_start: number, _deleteCount?: number): T[] {
        throw new Error("Cannot splice readonly array");
    }

    override reverse(): T[] {
        throw new Error("Cannot reverse readonly array");
    }

    override sort(_compareFn?: (a: T, b: T) => number): this {
        throw new Error("Cannot sort readonly array");
    }

    override copyWithin(_target: number, _start: number, _end?: number): this {
        throw new Error("Cannot copyWithin readonly array");
    }

    override fill(_value: T, _start?: number, _end?: number): this {
        throw new Error("Cannot fill readonly array");
    }
}

const empty: ReadOnlyArray<never> = [] as ReadOnlyArray<never>;

export function emptyArray<T>(): ReadOnlyArray<T> {
    return empty as ReadOnlyArray<T>;
}
