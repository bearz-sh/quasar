
export type Signal =
    | "SIGABRT"
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


export interface IPsOutput {
    /**
     * The spawned executable file.
     */
    readonly file: string | URL;
    /**
     * The arguments passed to the executable.
     */
    readonly args?: string[];
    /**
     * The signal that terminated the process, if any.
     */
    readonly signal: Signal | null;
    /**
     * The exit code of the process.
     */
    readonly code: number;
    /**
     * The standard output bytes of the process.
     */
    readonly stdout: Uint8Array;
    /**
     * The standard output as a string.
     */
    readonly stdoutText: string;
    /**
     * The standard output as an array of lines.
     */
    readonly stdoutLines: string[];
    /**
     * The standard error bytes of the process.
     */
    readonly stderr: Uint8Array;
    /**
     * The standard error as a string.
     */
    readonly stderrText: string;
    /**
     * The standard error as an array of lines.
     */
    readonly stderrLines: string[];
    /**
     * The start time of the process.
     */
    readonly start: Date;
    /**
     * The end time of the process.
     */
    readonly end: Date;

    /**
     * The stdout as a string.
     */
    toString(): string;
    /**
     * Determines whether the process was successful.
     * @param validator The validator to use to determine whether to throw or continue.
     */
    success(validator?: (code: number) => boolean): boolean;
    /**
     * Throws an error if the process was not successful. The default
     * is to throw if the exit code is not 0.
     * @param validator The validator to use to determine whether to throw or continue.
     */
    throwOrContinue(validator?: (code: number) => boolean): IPsOutput
}

export interface ICommandStatus {
    /**
     * The exit code of the process.
     */
    readonly code: number;

    /**
     * The signal that terminated the process, if any.
     */
    readonly signal: Signal | null;

    /**
     * The start time of the process.
     */
    readonly success: boolean;
}

export interface ICommandOutput {
    /**
     * The standard output bytes of the process.
     */
    readonly stdout: Uint8Array;

    /**
     * The standard error bytes of the process.
     */
    readonly stderr: Uint8Array;
}

/**
 * The standard stream options (`"inherit"` | `"piped"` | `"null"`) for stdin, stdout, stderr
 * streams.
 * 
 * * `"inherit"` - The stream is inherited from the parent process.
 * * `"piped"` - The stream is piped to the parent process.
 * * `"null"` - The stream is ignored.
 */
export type Stdio = "inherit" | "piped" | "null";

export interface ICommandOptions {
    /**
     * The working directory of the process.
     *
     * If not specified, the `cwd` of the parent process is used.
     */
    cwd?: string | URL;

    /**
     * The arguments passed to the executable.
     */
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

export interface IPsOutputArgs {
    file: string | URL;
    args?: string[];
    signal: Signal;
    code: number;
    stdout: Uint8Array;
    stderr: Uint8Array;
    start: Date;
    end?: Date;
}


export interface IPsStartInfo extends ICommandOptions {
    /**
     * The spawned executable file.
     */
    file: string | URL;

    /**
     * The text input to pass to the stdin of the process.
     */
    input?: Uint8Array | string | IPsOutput | ReadableStream<Uint8Array>;
}

export interface IPsCommand {

    /**
     * Creates a child process instance which allows more
     * control over the spawned process.
     */
    spawn(): IChildProcess;

    /**
     * Runs the command and returns the output.
     */
    output(): Promise<IPsOutput>;

    /**
     * Runs the command and returns the output
     * synchronously.
     */
    outputSync(): IPsOutput;
}

export interface IPipe {
    pipe(name: string, args?: ExecArgs, options?: IExecOptions) : IPipe
    pipe(next: IChildProcess | IPsCommand | IPsOutput) : IPipe
    output(): Promise<IPsOutput>;
}



export interface IChildProcess {
    /**
     * The spawned executable file.
     */
    readonly file: string | URL;

    /**
     * The arguments passed to the executable.
     */
    readonly args?: string[];

    /**
     * The process id provided by the OS.
     */
    readonly pid: number;

    /**
     * The status of the process. This is a promise that requires
     * the process to complete before resolving.
     */
    readonly status: Promise<ICommandStatus>;

    /**
     * The standard input stream of the process.
     */
    readonly stdin: WritableStream<Uint8Array>;

    /**
     * The standard output stream of the process.
     */
    readonly stdout: ReadableStream<Uint8Array>;

    /**
     * The standard error stream of the process.
     */
    readonly stderr: ReadableStream<Uint8Array>;

    /**
     * Pipes the output of this instance to the input of the
     * the next process.
     * @param next The process to pipe the output to.
     * @example
     * ```ts
     * ps("git", "status")
     * .pipe(ps("grep", "modified"))
     * .then(grep => grep.pipe(ps("tee", ["path/to/file"])))
     * 
     * // or
     * 
     * const grep = await ps("git", "status").pipe(ps("grep", "modified"))
     * grep.pipe(ps("tee", ["path/to/file"]))
     * 
     * ```
     */
    pipe(next: IChildProcess | IPsCommand) : IPipe;

    output(): Promise<IPsOutput>;

    kill(signal?: Signal): void;

    ref(): void;

    unref(): void;
}

export interface ISplatOptions {
    /**
     * The command to execute.
     */
    command?: string[] | string;
    /**
     * The prefix to use for commandline options. Defaults to `"--"`.
     */
    prefix?: string;
    /**
     * A lookup of aliases to remap the keys of the object
     * to the actual commandline option.  e.g. `{ "yes": "-y" }`
     * will map `{ yes: true }` to `["-y"]`.
     */
    aliases?: Record<string, string>;
    /**
     * The assigment token to use with options that have a value. The default
     * is to use a space. The common overrides are `":"` and `"="`.
     * This will turn `{ foo: "bar" }` into `["--foo", "bar"]` by default. If
     * assigned to `"="` it will become `["--foo=bar"]`.
     */
    assign?: string;
    /**
     * Whether to preserve the case of the keys. Defaults to `false`.
     */
    preserveCase?: boolean;
    shortFlag?: boolean;
    /**
     * Only include the keys that are in the `includes` array. Includes
     * take precedence over excludes.
     */
    includes?: Array<string | RegExp>;
    /**
     * Exclude the keys that are in the `excludes` array.
     */
    excludes?: Array<string | RegExp>;
    /**
     * Whether to ignore flags with `true` values. Defaults to `false`.
     */
    ignoreTrue?: boolean;
    /**
     * Whether to ignore flags with `false` values. Defaults to `false`.
     */
    ignoreFalse?: boolean;
    /**
     * The names of positional arguments. This will gather any keys as arguments
     * in the order of the given array.
     */
    arguments?: string[];
    /**
     * Whether to append the arguments to the end of the command. Defaults to `false`.
     */
    appendArguments?: boolean;
}

export interface IExecSyncOptions {
    /**
     * The working directory of the process.
     *
     * If not specified, the `cwd` of the parent process is used.
     */
    cwd?: string | URL;
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

    /** How `stdin` of the spawned process should be handled.
     *
     * Defaults to `"null"`. */
    stdin?: "piped" | "inherit" | "null";
    /** How `stdout` of the spawned process should be handled.
     *
     * Defaults to `"inherit"`. */
    stdout?: "piped" | "inherit" | "null";
    /** How `stderr` of the spawned process should be handled.
     *
     * Defaults to "inherit". */
    stderr?: "piped" | "inherit" | "null";

    /** Skips quoting and escaping of the arguments on Windows. This option
     * is ignored on non-windows platforms. Defaults to `false`. */
    windowsRawArguments?: boolean;

    splat?: ISplatOptions
}

export interface IExecOptions extends IExecSyncOptions {
    /**
     * An {@linkcode AbortSignal} that allows closing the process using the
     * corresponding {@linkcode AbortController} by sending the process a
     * SIGTERM signal.
     *
     * Ignored by {@linkcode Command.outputSync}.
     */
    signal?: AbortSignal;

    /**
     * The text input to pass to the stdin of the process.
     */
    input?: string | Uint8Array | ReadableStream<Uint8Array>;
}

export type ExecArgs = string | string[] | Record<string, unknown>
