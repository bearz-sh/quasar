import { Ptr, TypedStruct } from "../../../ffi/mod.ts";
export { Ptr };

/**
 * Converts a string, Uint8Array or Uint16Array to a wide string buffer.
 * @param str
 * @returns a buffer or null.
 */
export function convertToWideStringBuffer(str: string | null | Uint8Array | Uint16Array): Uint8Array | null {
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

    /**
     * @param str
     */
    constructor(str: string | Uint8Array | Uint16Array | null) {
        this.#bytes = convertToWideStringBuffer(str) ?? undefined;
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

    toString() {
        return new TextDecoder().decode(this.#bytes || new Uint8Array(0));
    }
}

/**
 * Windows API BOOL
 */
export enum BOOL {
    FALSE = 0,
    TRUE = 1,
}

export enum HRESULT {
    S_OK = 0,
    S_FALSE = 1,
    E_NOTIMPL = 0x80004001,
    E_ABORT = 0x80004004,
    E_FAIL = 0x80004005,
    E_UNEXPECTED = 0x8000FFFF,
    STG_E_INVALIDFUNCTION = 0x80030001,
    STG_E_INVALIDPOINTER = 0x80030009,
    STG_E_INVALIDPARAMETER = 0x80030057,
    STG_E_INVALIDFLAG = 0x800300FF,
    E_ACCESSDENIED = 0x80070005,
    E_INVALIDARG = 0x80070057,
}

export interface ISecurityAttributes {
    /** u32 */
    nLength: number;
    /** u32 */
    lpSecurityDescriptor: number;
    /** Windows.Win32.Foundation.BOOL */
    bInheritHandle: boolean;
}

const sizeofSymbol = Symbol.for("sizeof");

export class SecurityAttributes extends TypedStruct implements ISecurityAttributes {
    constructor(buf: Uint8Array) {
        super(buf);
    }

    static new(obj?: Partial<ISecurityAttributes>) {
        const buf = new Uint8Array(SecurityAttributes[sizeofSymbol]());
        const view = new DataView(buf.buffer);

        if (obj?.nLength !== undefined) {
            view.setUint32(0, obj.nLength ?? 0, true);
        }

        if (obj?.lpSecurityDescriptor !== undefined) {
            view.setUint32(4, obj.lpSecurityDescriptor ?? 0, true);
        }

        if (obj?.bInheritHandle !== undefined) {
            view.setInt32(8, obj.bInheritHandle ? 1 : 0, true);
        }
        return new SecurityAttributes(buf);
    }

    static [sizeofSymbol](): number {
        return 16;
    }

    // 0x00: u32
    get nLength(): number {
        return this.view.getUint32(0, true);
    }

    // 0x00: u32
    set nLength(value: number) {
        this.view.setUint32(0, value, true);
    }

    // 0x04: u32
    get lpSecurityDescriptor(): number {
        return this.view.getUint32(4, true);
    }

    // 0x04: u32
    set lpSecurityDescriptor(value: number) {
        this.view.setUint32(4, value, true);
    }

    // 0x08: i32
    get bInheritHandle(): boolean {
        return this.getBoolean(8);
    }

    // 0x08: i32
    set bInheritHandle(value: boolean) {
        this.setBoolean(8, value);
    }
}
