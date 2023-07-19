import { IWriter, IWriterSync, ICloser, IReader, IReaderSync } from '../streams/interfaces.ts';


export function chdir(directory: string | URL) {
    Deno.chdir(directory);
}

export function cwd() {
    return Deno.cwd();
}

export function exit(code?: number) {
    Deno.exit(code);
}

export const pid = Deno.pid;


export type Stdout = IWriter & IWriterSync & ICloser & {
    readonly rid: number;
    readonly writable: WritableStream<Uint8Array>
};

export type Stdin = IReader & IReaderSync & ICloser & {
    readonly rid: number;
    readonly readable: ReadableStream<Uint8Array>
}

export const stdout : Stdout = Deno.stdout;
export const stderr : Stdout = Deno.stderr;
export const stdin : Stdin = Deno.stdin;

export const args = Deno.args;