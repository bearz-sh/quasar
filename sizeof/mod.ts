// code modified from https://github.com/miktam/sizeof/blob/master/indexv2.js which is MIT licensed.
export const sizeofSymbol = Symbol.for("sizeof");

const TypeSizes = {
    STRING: 2,
    BOOLEAN: 4,
    BYTES: 4,
    NUMBER: 8,
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8,
};

function sizeTypedArray(buffer: ArrayBufferView): number {
    return buffer.byteLength;
}

const zero = BigInt(0);
const n256 = BigInt(256);

function toLittleEndian(bigNumber: bigint) {
    const result = new Uint8Array(32);
    let i = 0;

    while (bigNumber > zero) {
        result[i] = Number(bigNumber % n256);
        bigNumber = bigNumber / n256;
        i += 1;
    }
    return result;
}

function size(obj: unknown): number {
    if (obj === null || obj === undefined) {
        return 0;
    }

    if (ArrayBuffer.isView(obj)) {
        return sizeTypedArray(obj as ArrayBufferView);
    }

    const objectList = [];
    const stack = [obj];
    let bytes = 0;

    while (stack.length) {
        let value = stack.pop();

        if (typeof value === "boolean") {
            bytes += TypeSizes.BYTES;
        } else if (typeof value === "string") {
            // @ts-ignore TS2339: Property 'process' does not exist on type 'Window & typeof globalThis'.
            if (typeof globalThis.process !== "undefined" && globalThis.process.version) {
                bytes += 12 + 4 * Math.ceil(value.length / 4);
            } else {
                bytes += value.length * TypeSizes.STRING;
            }
        } else if (typeof value === "number") {
            bytes += TypeSizes.NUMBER;
        } else if (typeof value === "symbol") {
            const isGlobalSymbol = Symbol.keyFor && Symbol.keyFor(value);
            if (isGlobalSymbol) {
                // @ts-ignore TS2339: Property 'process' does not exist on type 'Window & typeof globalThis'.
                bytes += Symbol.keyFor(value).length * TypeSizes.STRING;
            } else {
                bytes += (obj.toString().length - 8) * TypeSizes.STRING;
            }
        } else if (typeof value === "bigint") {
            bytes += toLittleEndian(value).byteLength;
        } else if (typeof value === "function") {
            bytes += value.toString().length;
        } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
            if (obj instanceof Map) {
                value = Object.fromEntries(obj);
            } else if (obj instanceof Set) {
                value = Array.from(obj);
            }

            objectList.push(value);

            for (const i in value) {
                // @ts-ignore TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}

function sizeObject(obj: unknown): number {
    let totalSize = 0;
    const errorIndication = -1;

    try {
        // handle typed arrays
        if (ArrayBuffer.isView(obj)) {
            return sizeTypedArray(obj as ArrayBufferView);
        }

        // convert Map and Set to an object representation
        let convertedObj = obj;
        if (obj instanceof Map) {
            convertedObj = Object.fromEntries(obj);
        } else if (obj instanceof Set) {
            convertedObj = Array.from(obj);
        }

        const serializedObj = JSON.stringify(convertedObj, (_, value) => {
            if (typeof value === "bigint") {
                return value.toString();
            } else if (typeof value === "function") {
                return value.toString();
            } else if (typeof value === "undefined") {
                return "undefined";
            } else if (typeof value === "symbol") {
                return value.toString();
            } else if (value instanceof RegExp) {
                return value.toString();
            } else {
                return value;
            }
        });

        totalSize = new TextEncoder().encode(serializedObj).byteLength;
    } catch (ex) {
        console.error("Error detected, returning " + errorIndication, ex);
        return errorIndication;
    }

    return totalSize;
}

export function sizeof(obj: unknown): number | undefined {
    if (obj === null || obj === undefined) {
        return 0;
    }

    if (typeof obj === "object") {
        if (Object.getOwnPropertySymbols(obj).includes(sizeofSymbol)) {
            // deno-lint-ignore no-explicit-any
            return (obj as any)[sizeofSymbol];
        }

        return sizeObject(obj);
    }

    return size(obj);
}
