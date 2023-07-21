
let zeroPtr: Ptr | undefined = undefined;
let zeroUint8Array: Uint8Array | undefined = undefined;


export class Ptr 
{
    #ptr: Deno.PointerValue;

    constructor(value?: number | bigint | null | ArrayBuffer | Deno.PointerValue)
    {
        if (value === null) {
            this.#ptr = null;
            return;
        }

        if (value === undefined) {
            this.#ptr = Deno.UnsafePointer.of(new Uint8Array([0x0]));
            return;
        }

        if (typeof value === "object" && Object.getPrototypeOf(value) !== null &&
            value instanceof ArrayBuffer) {
            this.#ptr = Deno.UnsafePointer.of(value);
            return;
        }

        if (typeof value === "bigint" || typeof value === "number") {
            this.#ptr = Deno.UnsafePointer.create(value);
            return;
        }

        this.#ptr = value as Deno.PointerValue;
    }

    static get zero(): Ptr
    {
        if (zeroPtr === undefined) {
            zeroPtr = new Ptr(new Uint8Array([0x0]));
        }

        return zeroPtr;
    }

    get isNone(): boolean
    {
        return this.#ptr === null;
    }

    get value(): Deno.PointerValue
    {
        return this.#ptr;
    }

    set value(value: Deno.PointerValue)
    {
        this.#ptr = value;
    }
    
    equals(other: Ptr | Deno.PointerValue): boolean
    {
        if (other instanceof Ptr) {
            return Deno.UnsafePointer.equals(this.#ptr, other.#ptr);
        }

        return Deno.UnsafePointer.equals(this.#ptr, other);
    }

    toNumber(): number | bigint
    {
        return Deno.UnsafePointer.value(this.#ptr);
    }

    valueOf(): Deno.PointerValue
    {
        return this.#ptr;
    }

    toString(): string
    {
        return this.isNone ? "null" : Deno.UnsafePointer.value(this.#ptr).toString();
    }
}

export class Pstr
{
    #bytes?: Uint8Array;

    constructor(str: string | Uint8Array |  null)
    {
        if (typeof str === 'string') {
            this.#bytes = new TextEncoder().encode(str + "\0");
        }

        if (str instanceof Uint8Array) {
            this.#bytes = str;
        }
    }

    get isNone(): boolean
    {
        return this.#bytes === undefined;
    }

    get bytes(): Uint8Array
    {
        if (this.#bytes === undefined) 
           throw new Error("Object is none");

        return this.#bytes;
    }

    get length(): number
    {
        return this.#bytes?.length ?? 0;
    }

    static fromU8(bytes: Uint8Array): Pstr
    {
        return new Pstr(bytes);
    }

    static fromPtr(ptr: Deno.PointerValue)
    {
        if (ptr === null)
            return new Pstr(null);

        return new Pstr(Deno.UnsafePointerView.getCString(ptr));
    }

    toString() {

        return new TextDecoder().decode(this.#bytes || new Uint8Array(0));
    }
}

export class Pwstr
{
    #bytes?: Uint8Array;

    constructor(str: string | Uint8Array | Uint16Array |  null)
    {
        this.#bytes = Pwstr.convertToUtf16(str) ?? undefined;
    }

    get isNone(): boolean
    {
        return this.#bytes === undefined;
    }

    get value(): Uint8Array | null
    {
        if (this.#bytes === undefined) 
           throw new Error("Object is none");

        return this.#bytes;
    }

    get toPointer(): Deno.PointerValue
    {
        if (this.#bytes === undefined) 
           return null;

        return Deno.UnsafePointer.of(this.#bytes);
    }

    get length(): number
    {
        return this.#bytes?.length ?? 0;
    }

    static convertToUtf16(str: string | null | Uint8Array | Uint16Array): Uint8Array | null
    {
        if (str === null)
            return null;

        if (typeof str === 'string') {
            const u8a = new TextEncoder().encode(str + "\0");
            const u16a = new Uint16Array(u8a);
            return new Uint8Array(u16a.buffer);
        }

        if (str instanceof Uint8Array)
            return str;

        if (str instanceof Uint16Array)
            return new Uint8Array(str.buffer);

        return null;
    }

    toString()
    {   
        return new TextDecoder().decode(this.#bytes || new Uint8Array(0));
    }
}

export function convertStringToUtf16(str: string): Uint8Array
{
    const textEncoder = new TextEncoder();
    const utf8 = new Uint8Array(str.length);
    textEncoder.encodeInto(str, utf8);
    const utf16 = new Uint16Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        utf16[i] = utf8[i];
    }

    return new Uint8Array(utf16.buffer);
}