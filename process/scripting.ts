import {
    args,
    capture,
    captureSync,
    chdir,
    cwd,
    exec,
    execSync,
    exit,
    IExecOptions,
    IExecSyncOptions,
    isatty,
    PsOutput,
    run,
    runSync,
    splat,
    SplatOptions,
    stderr,
    stdin,
    stdout,
    which,
    whichSync,
} from "./mod.ts";
import { isProcessElevated } from "../os/os.ts";

export interface IProcess {
    readonly isElevated: boolean;

    /**
     * Gets or sets the current working directory of the process.
     */
    cwd: string;

    /**
     * Gets the arguments of the process.
     */
    readonly args: string[];

    /**
     * Gets the standard input stream.
     */
    readonly stdin: typeof stdin;

    /**
     * Gets the standard output stream.
     */
    readonly stdout: typeof stdout;

    /**
     * Gets the standard error stream.
     */
    readonly stderr: typeof stderr;

    run(...args: string[]): Promise<PsOutput>;

    runSync(...args: string[]): PsOutput;

    capture(...args: string[]): Promise<PsOutput>;

    captureSync(...args: string[]): PsOutput;

    exec(exec: string, args?: string[], options?: IExecOptions): Promise<PsOutput>;

    execSync(exec: string, args?: string[], options?: IExecSyncOptions): PsOutput;

    isatty(rid: number): boolean;

    push(path: string): void;

    pop(): void;

    exit(code?: number): void;

    splat(object: Record<string, unknown>, options?: SplatOptions): string[];

    which(exec: string): Promise<string | undefined>;

    whichSync(exec: string): string | undefined;
}

const defaultCwd = cwd();
const cwdHistory: string[] = [];

export const ps: IProcess = {
    args: args,
    /**
     * Gets or sets the current working directory of the process.
     */
    cwd: "",
    stdin,
    stdout,
    stderr,
    isElevated: isProcessElevated(),
    push(path: string) {
        cwdHistory.push(cwd());
        chdir(path);
    },
    pop() {
        const last = cwdHistory.pop() || defaultCwd;
        chdir(last);
        return last;
    },
    capture,
    captureSync,
    run,
    runSync,
    isatty,
    exec,
    execSync,
    exit,
    which,
    whichSync,
    splat,
};

Reflect.defineProperty(ps, "cwd", {
    get: () => cwd(),
    set: (value: string) => chdir(value),
    enumerable: true,
    configurable: true,
});
