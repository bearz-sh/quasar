import { ArgumentRangeError, NotSupportedError } from "../errors/mod.ts";
import { NEW_LINE } from "../os/constants.ts";

export class StringBuilder {
    #buffer: Uint8Array;
    #length: number;
    #encoder: TextEncoder;

    constructor(capacity = 16) {
        this.#length = 0;
        this.#buffer = new Uint8Array(capacity);
        this.#encoder = new TextEncoder();
    }

    static fromString(value: string) {
        const builder = new StringBuilder(value.length);
        builder.appendString(value);
        return builder;
    }

    static fromUint8Array(value: Uint8Array) {
        const builder = new StringBuilder(value.length);
        builder.appendUint8Array(value);
        return builder;
    }

    get length() {
        return this.#length;
    }

    private set length(value: number) {
        this.#length = value;
    }

    get(index: number) {
        return this.#buffer[index];
    }

    slice(start?: number, end?: number) {
        return this.#buffer.slice(start, end);
    }

    set(index: number, value: number) {
        this.#buffer[index] = value;
        return this;
    }

    copyTo(target: Uint8Array, targetIndex = 0, sourceIndex = 0, length = this.#length) {
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new ArgumentRangeError(
                "targetIndex",
                `Argument 'targetIndex' must be greater than -1 less than the length of the target array.`,
            );
        }

        if (sourceIndex < 0 || sourceIndex >= this.#length) {
            throw new ArgumentRangeError(
                "sourceIndex",
                `Argument 'sourceIndex' must be greater than -1 less than the length of the source array.`,
            );
        }

        if (length < 0 || length > this.#length - sourceIndex) {
            throw new ArgumentRangeError(
                "length",
                `Argument 'length' must be greater than -1 less than the length of the source array.`,
            );
        }

        target.set(this.#buffer.slice(sourceIndex, length), targetIndex);
        return this;
    }

    appendLine(value?: unknown) {
        if (value === undefined || value === null) {
            return this.append(NEW_LINE);
        }

        return this.append(value).append(NEW_LINE);
    }

    appendChar(value: number) {
        this.grow(this.length + 1);
        this.#buffer[this.length] = value;
        this.length++;

        return this;
    }

    appendU16Char(value: number) {
        this.grow(this.length + 2);
        this.#buffer[this.length] = value & 0xff;
        this.#buffer[this.length + 1] = (value >> 8) & 0xff;
        this.length += 2;
        return this;
    }

    appendBuilder(value: StringBuilder) {
        return this.appendUint8Array(value.#buffer.slice(0, value.#length));
    }

    appendString(value: string) {
        return this.appendUint8Array(this.#encoder.encode(value));
    }

    appendUint8Array(value: Uint8Array) {
        this.grow(this.#length + value.length);
        this.#buffer.set(value, this.#length);
        this.#length += value.length;
        return this;
    }

    append(value: unknown) {
        if (value === undefined || value === null) {
            return this;
        }

        if (value instanceof Uint8Array) {
            return this.appendUint8Array(value);
        }

        if (value instanceof StringBuilder) {
            return this.appendBuilder(value);
        }

        if (typeof value === "function") {
            throw new NotSupportedError("Function not supported");
        }

        return this.appendString(value.toString());
    }

    clear() {
        this.#buffer.fill(0);
        this.#length = 0;
        return this;
    }

    shrinkTo(capacity: number) {
        if (capacity < 0) {
            throw new ArgumentRangeError("capacity", `Argument 'capacity' must be greater than -1.`);
        }

        this.#buffer = this.#buffer.slice(0, capacity);
        return this;
    }

    trimExcess() {
        this.shrinkTo(this.#length);
        return this;
    }

    toArray() {
        return this.#buffer.slice(0, this.#length);
    }

    toString() {
        return new TextDecoder().decode(this.#buffer.slice(0, this.#length));
    }

    private grow(capacity: number) {
        if (capacity <= this.#buffer.length) {
            return;
        }

        capacity = Math.max(capacity, this.#buffer.length * 2);
        const newBuffer = new Uint8Array(capacity);
        newBuffer.set(this.#buffer);
        this.#buffer = newBuffer;
    }
}
