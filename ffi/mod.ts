let zeroPtr: Ptr | undefined = undefined;
// deno-lint-ignore no-unused-vars
const zeroUint8Array: Uint8Array | undefined = undefined;

export class Ptr {
    #ptr: Deno.PointerValue;

    constructor(value?: number | bigint | null | ArrayBuffer | Deno.PointerValue) {
        if (value === null) {
            this.#ptr = null;
            return;
        }

        if (value === undefined) {
            this.#ptr = Deno.UnsafePointer.of(new Uint8Array([0x0]));
            return;
        }

        if (
            typeof value === "object" && Object.getPrototypeOf(value) !== null &&
            value instanceof ArrayBuffer
        ) {
            this.#ptr = Deno.UnsafePointer.of(value);
            return;
        }

        if (typeof value === "bigint" || typeof value === "number") {
            this.#ptr = Deno.UnsafePointer.create(value);
            return;
        }

        this.#ptr = value as Deno.PointerValue;
    }

    static get zero(): Ptr {
        if (zeroPtr === undefined) {
            zeroPtr = new Ptr(new Uint8Array([0x0]));
        }

        return zeroPtr;
    }

    get isNone(): boolean {
        return this.#ptr === null;
    }

    get value(): Deno.PointerValue {
        return this.#ptr;
    }

    set value(value: Deno.PointerValue) {
        this.#ptr = value;
    }

    equals(other: Ptr | Deno.PointerValue): boolean {
        if (other instanceof Ptr) {
            return Deno.UnsafePointer.equals(this.#ptr, other.#ptr);
        }

        return Deno.UnsafePointer.equals(this.#ptr, other);
    }

    toNumber(): number | bigint {
        return Deno.UnsafePointer.value(this.#ptr);
    }

    valueOf(): Deno.PointerValue {
        return this.#ptr;
    }

    toString(): string {
        return this.isNone ? "null" : Deno.UnsafePointer.value(this.#ptr).toString();
    }
}

export abstract class TypedStruct {
    protected readonly view: DataView;
    constructor(private readonly buf: Uint8Array) {
        this.view = new DataView(buf.buffer);
    }

    toBuffer(): Uint8Array {
        return this.buf;
    }

    getBoolean(offset: number): boolean {
        return this.view.getUint8(offset) === 1;
    }

    protected setBoolean(offset: number, value: boolean) {
        this.view.setUint8(offset, value ? 1 : 0);
    }
}
