import { IWriter, IWriterSync, ICloser, IReader, IReaderSync } from '../streams/interfaces.ts';




export type Signal = | "SIGABRT"
| "SIGALRM"
| "SIGBREAK"
| "SIGBUS"
| "SIGCHLD"
| "SIGCONT"
| "SIGEMT"
| "SIGFPE"
| "SIGHUP"
| "SIGILL"
| "SIGINFO"
| "SIGINT"
| "SIGIO"
| "SIGKILL"
| "SIGPIPE"
| "SIGPROF"
| "SIGPWR"
| "SIGQUIT"
| "SIGSEGV"
| "SIGSTKFLT"
| "SIGSTOP"
| "SIGSYS"
| "SIGTERM"
| "SIGTRAP"
| "SIGTSTP"
| "SIGTTIN"
| "SIGTTOU"
| "SIGURG"
| "SIGUSR1"
| "SIGUSR2"
| "SIGVTALRM"
| "SIGWINCH"
| "SIGXCPU"
| "SIGXFSZ";

export interface ICommandStatus {
    readonly code: number;

    readonly signal: Signal | null;

    readonly success: boolean;
}

export interface ICommandOutput {
    readonly stdout: Uint8Array;

    readonly stderr: Uint8Array;
}

export interface IChildProcess {
    readonly pid: number;

    readonly status: Promise<ICommandStatus>;

    readonly stdin: WritableStream<Uint8Array>;

    readonly stdout: ReadableStream<Uint8Array>;

    readonly stderr: ReadableStream<Uint8Array>;

    output(): Promise<ICommandOutput>;

    kill(signal?: Signal): void;

    ref(): void;

    unref(): void;
}

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