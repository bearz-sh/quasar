export type Win32Error = number;

/**
 * Windows string pointer
 */
export class Pstr {
    #bytes?: Uint8Array;

    constructor(str: string | Uint8Array | null) {
        if (typeof str === "string") {
            this.#bytes = new TextEncoder().encode(str + "\0");
        }

        if (str instanceof Uint8Array) {
            this.#bytes = str;
        }
    }

    get isNone(): boolean {
        return this.#bytes === undefined;
    }

    get bytes(): Uint8Array {
        if (this.#bytes === undefined) {
            throw new Error("Object is none");
        }

        return this.#bytes;
    }

    get length(): number {
        return this.#bytes?.length ?? 0;
    }

    static fromU8(bytes: Uint8Array): Pstr {
        return new Pstr(bytes);
    }

    static fromPtr(ptr: Deno.PointerValue) {
        if (ptr === null) {
            return new Pstr(null);
        }

        return new Pstr(Deno.UnsafePointerView.getCString(ptr));
    }

    toString() {
        return new TextDecoder().decode(this.#bytes || new Uint8Array(0));
    }
}

/**
 * Windows wide string pointer
 * @class
 */
export class Pwstr {
    #bytes?: Uint8Array;

    constructor(str: string | Uint8Array | Uint16Array | null) {
        this.#bytes = Pwstr.convertToUtf16(str) ?? undefined;
    }

    get isNone(): boolean {
        return this.#bytes === undefined;
    }

    get value(): Uint8Array | null {
        if (this.#bytes === undefined) {
            throw new Error("Object is none");
        }

        return this.#bytes;
    }

    get toPointer(): Deno.PointerValue {
        if (this.#bytes === undefined) {
            return null;
        }

        return Deno.UnsafePointer.of(this.#bytes);
    }

    get length(): number {
        return this.#bytes?.length ?? 0;
    }

    static convertToUtf16(str: string | null | Uint8Array | Uint16Array): Uint8Array | null {
        if (str === null) {
            return null;
        }

        if (typeof str === "string") {
            const u8a = new TextEncoder().encode(str + "\0");
            const u16a = new Uint16Array(u8a);
            return new Uint8Array(u16a.buffer);
        }

        if (str instanceof Uint8Array) {
            return str;
        }

        if (str instanceof Uint16Array) {
            return new Uint8Array(str.buffer);
        }

        return null;
    }

    toString() {
        return new TextDecoder().decode(this.#bytes || new Uint8Array(0));
    }
}
