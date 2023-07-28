import { StringBuilder } from "../../text/string_builder.ts";

export function pwstrFromFfi(ptr: Deno.PointerValue): string | null {
    if (ptr === null) {
        return null;
    }

    const view = new Deno.UnsafePointerView(ptr);
    const sb = new StringBuilder();
    for (let i = 0;; i += 2) {
        const code = view.getUint16(i);
        if (code === 0) {
            break;
        }

        sb.appendU16Char(code);
    }
    return sb.toString();
}

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
        if (!this.#bytes) {
            return null;
        }

        return new TextDecoder().decode(this.#bytes);
    }
}

export class Pwstr {
    #bytes?: Uint8Array;

    constructor(str: string | Uint8Array | Uint16Array | null) {
        if (typeof str === "string") {
            const u8 = new TextEncoder().encode(str + "\0");
            const u16 = new Uint16Array(u8);
            this.#bytes = new Uint8Array(u16.buffer);
        }

        if (str instanceof Uint8Array) {
            this.#bytes = str;
        }

        if (str instanceof Uint16Array) {
            this.#bytes = new Uint8Array(str.buffer);
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

    static fromU8(bytes: Uint8Array): Pwstr {
        return new Pwstr(new TextDecoder().decode(bytes));
    }

    static fromU16(bytes: Uint16Array): Pwstr {
        return new Pwstr(new Uint8Array(bytes.buffer));
    }

    static fromPtr(ptr: Deno.PointerValue): Pwstr {
        const str = pwstrFromFfi(ptr);
        return new Pwstr(str);
    }

    static fromString(str: string): Pwstr {
        return new Pwstr(str);
    }

    toString() {
        if (!this.#bytes) {
            return null;
        }
        return new TextDecoder().decode(this.#bytes);
    }
}
