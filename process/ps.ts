export type Stdio = "inherit" | "piped" | "null";

export interface ICommandOptions {
    /**
    * The working directory of the process.
    *
    * If not specified, the `cwd` of the parent process is used.
    */
    cwd?: string | URL;

    args?: string[];
    /**
     * Clear environmental variables from parent process.
     *
     * Doesn't guarantee that only `env` variables are present, as the OS may
     * set environmental variables for processes.
     */
    clearEnv?: boolean;
    /** Environmental variables to pass to the subprocess. */
    env?: Record<string, string>;
    /**
     * Sets the child process’s user ID. This translates to a setuid call in the
     * child process. Failure in the set uid call will cause the spawn to fail.
     */
    uid?: number;
    /** Similar to `uid`, but sets the group ID of the child process. */
    gid?: number;
    /**
     * An {@linkcode AbortSignal} that allows closing the process using the
     * corresponding {@linkcode AbortController} by sending the process a
     * SIGTERM signal.
     *
     * Ignored by {@linkcode Command.outputSync}.
     */
    signal?: AbortSignal;

    /** How `stdin` of the spawned process should be handled.
     *
     * Defaults to `"null"`. */
    stdin?: "piped" | "inherit" | "null";
    /** How `stdout` of the spawned process should be handled.
     *
     * Defaults to `"piped"`. */
    stdout?: "piped" | "inherit" | "null";
    /** How `stderr` of the spawned process should be handled.
     *
     * Defaults to "piped". */
    stderr?: "piped" | "inherit" | "null";

    /** Skips quoting and escaping of the arguments on Windows. This option
     * is ignored on non-windows platforms. Defaults to `false`. */
    windowsRawArguments?: boolean;
}

export interface IPsStartInfo extends ICommandOptions
{
    file: string | URL;
}


export class PsOutput
{
    #output: Deno.CommandOutput;
    #si: IPsStartInfo
    #stdoutString?: string;
    #stderrString?: string;
    #stdoutLines?: string[];
    #stderrLines?: string[];

    constructor(si: IPsStartInfo, output: Deno.CommandOutput) 
    {
        this.#si = si;
        this.#output = output;
    }

    get file() {
        return this.#si?.file;
    }

    get args() {
        return this.#si.args;
    }

    get code() {
        return this.#output.code;
    }

    get signal() {
        return this.#output.signal;
    }

    get stdout() {
        if(this.#si?.stdout === 'piped') {
            return this.#output.stdout;
        }

        return new Uint8Array();
    }

    get stdoutAsString() {
        if(this.#stdoutString) {
            return this.#stdoutString;
        }

        if(this.#si?.stdout === 'piped') { 
            this.#stdoutString = new TextDecoder().decode(this.#output.stdout);
        } else {
            this.#stdoutString = '';
        }

        return this.#stdoutString;
    }

    get stderr() {
        if(this.#si?.stderr === 'piped') {
            return this.#output.stderr;
        }

        return new Uint8Array();
    }

    get stderrAsString() {
        if(this.#stderrString) {
            return this.#stderrString;
        }

        if(this.#si?.stderr === 'piped') {
            this.#stderrString = new TextDecoder().decode(this.#output.stderr);
        } else {
            this.#stderrString = '';
        }

        return this.#stderrString;
    }

    get stdoutAsLines() {   
        if(this.#stdoutLines) {
            return this.#stdoutLines;
        }

        if(this.#si?.stdout === 'piped') {
            this.#stdoutLines = this.stdoutAsString.split('\n');
        } else {
            this.#stdoutLines = [];
        }

        return this.#stdoutLines;
    }

    get stderrAsLines() {
        if(this.#stderrLines) {
            return this.#stderrLines;
        }

        if(this.#si?.stderr === 'piped') {
            this.#stderrLines = this.stderrAsString.split('\n');
        }

        return this.#stderrLines;
    }

    success(validate?: (code: number) => boolean) {
        if(!validate) {
            return this.code === 0;
        }

        return validate(this.code);
    }

    throwOrContinue(validate?: (code: number) => boolean) {
        if(!this.success(validate)) {
            throw new Error(`Process failed with code ${this.code} and signal ${this.signal}`);
        }

        return this;
    }
}

export interface IPsPreHook {
    (si: IPsStartInfo) : void;
}

export interface IPsPostHook {
    (si: IPsStartInfo, result: PsOutput) : void;
}

export const preCallHooks: IPsPreHook[] = [];

export const postCallHooks: IPsPostHook[] = [];

export class Ps
{
    #startInfo: IPsStartInfo

    constructor(startInfo?: IPsStartInfo)
    {
        this.#startInfo = startInfo ?? { file: '', stdout: 'inherit', stderr: 'inherit'};
    }

    withFile(file: string | URL) {
        this.#startInfo.file = file;
        return this;
    }

    addEnv(key: string, value: string)
    {
        if (this.#startInfo.env == undefined) {
            this.#startInfo.env = {};
        }
        this.#startInfo.env[key] = value;
        return this;
    }


    withArgs(args: string[])
    {
        this.#startInfo.args = args;
        return this;
    }

    withEnv(env: { [key: string]: string })
    {
        if (this.#startInfo.env == undefined) {
            this.#startInfo.env = env;
            return this;
        }

        for (const key in env) {
            this.#startInfo.env[key] = env[key];
        }

        return this;
    }

    withStdin(stdin: "inherit" | "piped" | "null")
    {
        this.#startInfo.stdin = stdin;
        return this;
    }

    withStdout(stdout: "inherit" | "piped" | "null")
    {
        this.#startInfo.stdout = stdout;
        return this;
    }

    withStderr(stderr: "inherit" | "piped" | "null")
    {
        this.#startInfo.stderr = stderr;
        return this;
    }



    async output()
    {
        if(preCallHooks.length > 0) {
            preCallHooks.forEach((hook) => {
                hook(this.#startInfo);
            });
        }

        const cmd = new Deno.Command(this.#startInfo.file, this.#startInfo);
        const result = await cmd.output();
        const output = new PsOutput(this.#startInfo, result);

        if (postCallHooks.length > 0) {
            postCallHooks.forEach((hook) => {
                hook(this.#startInfo, output);
            });
        }

        return output;
    }

    outputSync()
    {
        if(preCallHooks.length > 0) {
            preCallHooks.forEach((hook) => {
                hook(this.#startInfo);
            });
        }

        const cmd = new Deno.Command(this.#startInfo.file, this.#startInfo);
        const result = cmd.outputSync();
        const output = new PsOutput(this.#startInfo, result);

        if (postCallHooks.length > 0) {
            postCallHooks.forEach((hook) => {
                hook(this.#startInfo, output);
            });
        }

        return output;
    }
}

export function run(...args: string[])
{
    const si : IPsStartInfo = {
        file: args[0],
        args: args.slice(1),
        stdout: 'inherit',
        stderr: 'inherit'
    }
    const ps = new Ps(si);
    return ps.output();
}

export function runSync(...args: string[])
{
    const si : IPsStartInfo = {
        file: args[0],
        args: args.slice(1),
        stdout: 'inherit',
        stderr: 'inherit'
    }
    const ps = new Ps(si);
    return ps.outputSync();
}

export function capture(...args: string[])
{
    const si : IPsStartInfo = {
        file: args[0],
        args: args.slice(1),
        stdout: 'piped',
        stderr: 'piped'
    }
    const ps = new Ps(si);
    return ps.output();
}

export function captureSync(...args: string[])
{
    const si : IPsStartInfo = {
        file: args[0],
        args: args.slice(1),
        stdout: 'piped',
        stderr: 'piped'
    }
    const ps = new Ps(si);
    return ps.outputSync();
}

export function output(startInfo: IPsStartInfo)
{
    const ps = new Ps(startInfo);
    return ps.output();
}

export function outputSync(startInfo: IPsStartInfo)
{
    const ps = new Ps(startInfo);
    return ps.outputSync();
}