import { NotFoundOnPathError } from "../errors/mod.ts";
import { NEW_LINE } from "../mod.ts";
import { ExecArgs, IChildProcess, IExecOptions, IExecSyncOptions, IPsStartInfo, IPsOutput, Signal, ISplatOptions, IPsOutputArgs, IPsCommand, IPipe } from "./interfaces.ts";

import { findExe, findExeSync } from "./registry.ts";
import { splat } from "./splat.ts";
import { splitArguments } from "./split_arguments.ts";

export type { IChildProcess, IPsStartInfo, Signal }

export { PsOutput }
export interface IPsPreHook {
    (si: IPsStartInfo): void;
}

export interface IPsPostHook {
    (si: IPsStartInfo, result: PsOutput): void;
}

export const preCallHooks: IPsPreHook[] = [];

export const postCallHooks: IPsPostHook[] = [];

export class Pipe implements IPipe {
    #promise: Promise<IChildProcess>

    constructor(
        private readonly process: IChildProcess
    ) {
        this.#promise = Promise.resolve(process);
    }

    pipe(name: string, args?: ExecArgs, options?: IExecOptions) : IPipe
    pipe(next: IChildProcess | IPsCommand | IPsOutput) : IPipe
    pipe(): IPipe {
        if (arguments.length === 0)
            throw new Error("Invalid arguments");

        if (typeof arguments[0] === 'string') {
            const args = arguments[1] as ExecArgs;
            const options = arguments[2] as IExecOptions;
            const next = ps(arguments[0], args, options);
            return this.pipe(next);
        }

        const next = arguments[0];


        this.#promise = this.#promise.then(async (process) => {
            let child = next as IChildProcess;
            if (typeof next === 'object' && 'spawn' in next) {
                if (next instanceof Ps) {
                    next.withStdin('piped');
                }
                child = next.spawn();
            }

            try 
            {
                await process.stdout.pipeTo(child.stdin);
                await process.stdin.abort();
                await process.stderr.cancel();
                await process.status;
            } catch (ex) {
                throw new Error(`Pipe failed for ${process.file}: ${ex.message} ${ex.stack}`)
            }

         

            return child;
        });
        return this;
    }

    async output(): Promise<IPsOutput> {
        const process = await this.#promise.finally();
        return process.output();
    }
}

class PsOutput implements IPsOutput {
    #stdout: Uint8Array;
    #stderr: Uint8Array;
    #code: number;
    #signal?: Signal;
    #stdoutString?: string;
    #stderrString?: string;
    #stdoutLines?: string[];
    #stderrLines?: string[];
    #split?: string;
    #file: string | URL;
    #args?: string[];
    #start: Date;
    #end: Date;

    constructor(data: IPsOutputArgs) {
        this.#end = new Date();
        this.#start = data.start;
        this.#file = data.file;
        this.#stderr = data.stderr ?? new Uint8Array();
        this.#stdout = data.stdout ?? new Uint8Array();
        this.#args = data.args;
        this.#code = data.code;
        this.#signal = data.signal;
    }

    set split(value: string) {
        this.split = value;
    }

    get file() {
        return this.#file;
    }

    get args() {
        return this.#args;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get code() {
        return this.#code;
    }

    get signal() {
        return this.#signal as Signal;
    }

    get stdout() {
        return this.#stdout;
    }

    get stdoutText() {
        if (this.#stdoutString) {
            return this.#stdoutString;
        }

        if (this.#stdout.length) {
            this.#stdoutString = new TextDecoder().decode(this.#stdout);
        } else {
            this.#stdoutString = "";
        }

        return this.#stdoutString;
    }

    get stderr() {
        return this.#stderr;
    }

    get stderrText() {
        if (this.#stderrString) {
            return this.#stderrString;
        }

        if (this.#stderr.length) {
            this.#stderrString = new TextDecoder().decode(this.#stderr);
        } else {
            this.#stderrString = "";
        }

        return this.#stderrString;
    }

    get stdoutLines() {
        if (this.#stdoutLines)
            return this.#stdoutLines;

        if (this.stdout.length)
            return this.#stdoutLines = this.stdoutText.split(this.split || NEW_LINE);

        this.#stdoutLines = [];
        return this.#stdoutLines;
    }

    get stderrLines() {
        if (this.#stderrLines)
            return this.#stderrLines;

        if (this.stderr.length)
            return this.#stderrLines = this.stderrText.split(this.split || NEW_LINE);

        this.#stderrLines = [];
        return this.#stderrLines;
    }

    success(validate?: (code: number) => boolean) {
        if (!validate) {
            return this.code === 0;
        }

        return validate(this.code);
    }

    throwOrContinue(validate?: (code: number) => boolean) : IPsOutput {
        if ((validate && !validate(this.code)) || this.code !== 0) {
            throw new Error(`Process failed with code ${this.code} and signal ${this.signal}`);
        }

        return this;
    }

    toString() {
        return this.stdoutText
    }
}

class ChildProcess implements IChildProcess {
    #piped: boolean
    #start: Date
    constructor(private readonly process: Deno.ChildProcess, private readonly si: IPsStartInfo, start?: Date) {
        this.#piped = false;
        this.#start = start ?? new Date();
    }

    get pid () {
        return this.process.pid;
    }

    get file() {
        return this.si.file;
    }

    get args() {
        return this.si.args;
    }


    get status() {
        return this.process.status;
    }

    get stdin() {
        return this.process.stdin;
    }

    get stdout() {
        return this.process.stdout;
    }

    get stderr() {
        return this.process.stderr;
    }

         
    pipe(next: IChildProcess | IPsCommand): IPipe {
        this.#piped = true;
        return new Pipe(this).pipe(next);
    }

       
    async output(): Promise<IPsOutput> {
        const child = this.process;
        if (!this.#piped && this.si.input && !child.stdin.locked)
        {
            const input = this.si.input;
            if (input instanceof PsOutput) {
                const writer = child.stdin.getWriter();
                await writer.write(input.stdout);
                await writer.close();
                writer.releaseLock();
            }
    
            if (input instanceof Uint8Array) {
                const writer = child.stdin.getWriter();
                await writer.write(input);
                await writer.close();
                writer.releaseLock();
            }
    
            if (input instanceof ReadableStream) {
                const writer = child.stdin.getWriter();
                const reader = input.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
    
                    await writer.write(value);
                }
                await writer.close();
                await reader.closed;
                reader.releaseLock();
                writer.releaseLock();
            }
    
            if (typeof input === "string") {
                const writer = child.stdin.getWriter();
                await writer.write(new TextEncoder().encode(input));
                await writer.close();
                writer.releaseLock();
            }
        }

        
        const result = await this.process.output();
        const output = new PsOutput({
            file: this.si.file,
            args: this.si.args,
            stdout: this.si.stdout === 'piped' ? result.stdout : new Uint8Array(),
            stderr: this.si.stderr === 'piped' ? result.stderr : new Uint8Array(),
            code: result.code,
            signal: result.signal as Signal,
            start: this.#start,
        });

        return output;
    }

    kill(signal?: Signal) {
        this.process.kill(signal);
    }     

    ref() {
        this.process.ref();
    }

    unref() {
        this.process.unref();
    }
}

export class Ps implements IPsCommand {
    #startInfo: IPsStartInfo;
    #child?: IChildProcess;

    constructor(startInfo?: IPsStartInfo) {
        this.#startInfo = startInfo ?? { file: "", stdout: "piped", stderr: "piped" };
        if (!this.#startInfo.stdout)
            this.#startInfo.stdout = "piped";

        if (!this.#startInfo.stderr)
            this.#startInfo.stderr = "piped";
    }

    withFile(file: string | URL) {
        this.#startInfo.file = file;
        return this;
    }

    addEnv(key: string, value: string) {
        if (this.#startInfo.env == undefined) {
            this.#startInfo.env = {};
        }
        this.#startInfo.env[key] = value;
        return this;
    }

    withArgs(args: string[]) {
        this.#startInfo.args = args;
        return this;
    }

    withEnv(env: { [key: string]: string }) {
        if (this.#startInfo.env == undefined) {
            this.#startInfo.env = env;
            return this;
        }

        for (const key in env) {
            this.#startInfo.env[key] = env[key];
        }

        return this;
    }

    withInput(input: Uint8Array | string | ReadableStream | PsOutput) {
        this.#startInfo.input = input;
        this.#startInfo.stdin = "piped";
        return this;
    }

    withStdin(stdin: "inherit" | "piped" | "null") {
        this.#startInfo.stdin = stdin;
        return this;
    }

    withStdout(stdout: "inherit" | "piped" | "null") {
        this.#startInfo.stdout = stdout;
        return this;
    }

    withStderr(stderr: "inherit" | "piped" | "null") {
        this.#startInfo.stderr = stderr;
        return this;
    }

    pipe(name: string, args?: ExecArgs, options?: IExecOptions) : IPipe
    pipe(next: IChildProcess | Ps) : IPipe
    pipe() : IPipe
    {
        this.#startInfo.stdout = "piped";
        this.#startInfo.stderr = "piped";

        if (arguments.length === 0)
            throw new Error("Invalid arguments");

        if (typeof arguments[0] === 'string') {
            const args = arguments[1] as ExecArgs;
            const options = arguments[2] as IExecOptions;
            const next = ps(arguments[0], args, options);
            return this.pipe(next);
        }

        return new Pipe(this.spawn()).pipe(arguments[0]);
    }

    spawn() {
        if (this.#child)
            return this.#child;

        if (preCallHooks.length > 0) {
            preCallHooks.forEach((hook) => {
                hook(this.#startInfo);
            });
        }

        const start = new Date();
        const cmd = new Deno.Command(this.#startInfo.file, this.#startInfo);
        return new ChildProcess(cmd.spawn(), this.#startInfo, start);
    }

    async output() {
        if (preCallHooks.length > 0) {
            preCallHooks.forEach((hook) => {
                hook(this.#startInfo);
            });
        }

        if (!this.#startInfo.input) {
            const start = new Date();
            const cmd2 = new Deno.Command(this.#startInfo.file, this.#startInfo);
            const result = await cmd2.output();
            const output = new PsOutput({
                file: this.#startInfo.file,
                args: this.#startInfo.args,
                stdout: this.#startInfo.stdout === 'piped' ? result.stdout : new Uint8Array(),
                stderr: this.#startInfo.stderr === 'piped' ? result.stderr : new Uint8Array(),
                code: result.code,
                signal: result.signal as Signal,
                start: start,
            });

            if (postCallHooks.length > 0) {
                postCallHooks.forEach((hook) => {
                    hook(this.#startInfo, output);
                });
            }

            return output;
        }

        const input = this.#startInfo.input;
        this.#startInfo.stdin = "piped";
        const cmd = new Deno.Command(this.#startInfo.file, this.#startInfo);

        const child = cmd.spawn();
        if (input instanceof PsOutput) {
            const writer = child.stdin.getWriter();
            await writer.write(input.stdout);
            await writer.close();
        }

        if (input instanceof Uint8Array) {
            const writer = child.stdin.getWriter();
            await writer.write(input);
            await writer.close();
        }

        if (input instanceof ReadableStream) {
            const writer = child.stdin.getWriter();
            const reader = input.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                await writer.write(value);
            }
            await writer.close();
        }

        if (typeof input === "string") {
            const writer = child.stdin.getWriter();
            await writer.write(new TextEncoder().encode(input));
            await writer.close();
        }

        const result = await child.output();
        const start = new Date();
        const output = new PsOutput({
            file: this.#startInfo.file,
            args: this.#startInfo.args,
            stdout: this.#startInfo.stdout === 'piped' ? result.stdout : new Uint8Array(),
            stderr: this.#startInfo.stderr === 'piped' ? result.stderr : new Uint8Array(),
            code: result.code,
            signal: result.signal as Signal,
            start: start,
        });

        if (postCallHooks.length > 0) {
            postCallHooks.forEach((hook) => {
                hook(this.#startInfo, output);
            });
        }

        return output;
    }

    outputSync() {
        if (preCallHooks.length > 0) {
            preCallHooks.forEach((hook) => {
                hook(this.#startInfo);
            });
        }

        const cmd = new Deno.Command(this.#startInfo.file, this.#startInfo);
        const result = cmd.outputSync();
        const date = new Date();
        const output = new PsOutput({
            file: this.#startInfo.file,
            args: this.#startInfo.args,
            stdout: this.#startInfo.stdout === 'piped' ? result.stdout : new Uint8Array(),
            stderr: this.#startInfo.stderr === 'piped' ? result.stderr : new Uint8Array(),
            code: result.code,
            signal: result.signal as Signal,
            start: date,
        });

        if (postCallHooks.length > 0) {
            postCallHooks.forEach((hook) => {
                hook(this.#startInfo, output);
            });
        }

        return output;
    }
}

function convertArgs(args?: ExecArgs, splatOptions?: ISplatOptions): string[] | undefined {
    if (!args)
        return undefined

    if (Array.isArray(args)) {
        return args;
    }

    if (typeof args === "string") {
        return splitArguments(args);
    }

    return splat(args, splatOptions);
}

export function ps(name: string, args?: ExecArgs, options?: IExecOptions) {
    const path = findExeSync(name);
    if (!path) {
        throw new NotFoundOnPathError(name);
    }

    const a = convertArgs(args, options?.splat);

    const si: IPsStartInfo = {
        ...options,
        file: path,
        args: a,
    };

    if (si.stdout === undefined)
        si.stdout = "piped";

    if (si.stderr === undefined)
        si.stderr = "piped";

    if (options?.input || si.stdin === undefined)
        si.stdin = 'piped';

    return new Ps(si);
}


export async function exec(name: string, args?: ExecArgs, options?: IExecOptions) {
    
    const path = await findExe(name);
    if (!path) {
        throw new NotFoundOnPathError(name);
    }

    const a = convertArgs(args, options?.splat);

    const si: IPsStartInfo = {
        ...options,
        file: path,
        args: a,
    };

    if (si.stdout === undefined)
        si.stdout = "inherit";

    if (si.stderr === undefined)
        si.stderr = "inherit";

    if (options?.input)
        si.stdin = 'piped';
    
    return new Ps(si).output();
}

export function execSync(name: string, args?: ExecArgs, options?: IExecSyncOptions) {
    const path = findExeSync(name);
    if (!path) {
        throw new NotFoundOnPathError(name);
    }

    const a = convertArgs(args, options?.splat);

    const si: IPsStartInfo = {
        ...options,
        file: path,
        args: a,
    };

    if (si.stdout === undefined)
        si.stdout = "inherit";

    if (si.stderr === undefined)
        si.stderr = "inherit";

    return new Ps(si).outputSync();
}

export function capture(name: string, args?: ExecArgs, options?: Omit<IExecOptions, 'stdout' | 'stderr'>) {
    const o : IExecOptions = {
        ...options,
        stdout: "piped",
        stderr: "piped",
    };

    return exec(name, args, o)
}

export function captureSync(name: string, args?: ExecArgs, options?: Omit<IExecSyncOptions, 'stdout' | 'stderr'>) {
    const o : IExecSyncOptions = {
        ...options,
        stdout: "piped",
        stderr: "piped",
    };

    return execSync(name, args, o)
}