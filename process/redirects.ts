import { NEW_LINE } from "../mod.ts";
import { StringBuilder } from "../text/string_builder.ts";

export interface IPsCapture {
    next(data: Uint8Array): void;
    complete(): Promise<void>;
}

export class WritableStreamCapture implements IPsCapture {
    #writer: WritableStreamDefaultWriter<Uint8Array>;
    
    constructor(stream: WritableStream<Uint8Array>) {
        this.#writer = stream.getWriter();
    }
    
    next(data: Uint8Array): void {
        this.#writer.write(data);
    }
    
    complete(): Promise<void> {
        this.#writer.close();
        return this.#writer.closed;
    }
}

export class StringArrayCapture implements IPsCapture {
    #builder: StringBuilder

    constructor(private readonly array: string[]) {
        this.#builder = new StringBuilder();
    }

    next(data: Uint8Array): void {
        this.#builder.append(data);
    }

    complete(): Promise<void> {
        const p = new Promise<void>((resolve) => {
            const results = this.#builder.toString().split(NEW_LINE);
            this.#builder.clear();
            for(const result of results) {
                this.array.push(result);
            }

            resolve(undefined);
        });

        return p;
    }
}

export function redirect(stream: ReadableStream<Uint8Array>, captures: IPsCapture[]) {
    const reader = stream.getReader();
    let done = false;

    const read = async () => {
        if (done) {
            return;
        }

        const { value, done: d } = await reader.read();
        if (d) {
            done = true;
            for (const capture of captures) {
                await capture.complete();
            }

            return;
        }

        for (const capture of captures) {
            capture.next(value);
        }

        await read();
    };

    read();
}