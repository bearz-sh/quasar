import {
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IMakeTempOptions,
    IRemoveOptions,
    ISymlinkOptions,
    IWriteOptions,
} from "../fs/_interfaces.ts";
import { Result } from "../optional/result.ts";
import { OsFamily, RuntimeArch } from "../os/constants.ts";
import { IEnvSubstitutionOptions } from "../os/env.ts";
import { ParsedPath } from "../path/mod.ts";
import { IExecOptions } from "../process/exec.ts";
import { PsOutput } from "../process/ps.ts";

export interface IEnvPath {
    get(): string;

    set(path: string): void;

    add(value: string, prepend?: boolean): void;

    remove(value: string): void;

    has(value: string): boolean;

    split(): string[];
}

export interface IEnv {
    expand(template: string, options?: IEnvSubstitutionOptions): string;

    get(name: string): string | undefined;

    getOrDefault(key: string, defaultValue: string): string;

    getRequired(name: string): string;

    set(key: string, value: string): void;
    set(key: string, value: string, isSecret: boolean): void;
    set(map: { [key: string]: string }): void;

    remove(name: string): void;

    has(name: string): boolean;

    toObject(): Record<string, string | undefined>;

    path: IEnvPath;
}

export interface IPath {
    join(...paths: string[]): string;

    resolve(...paths: string[]): string;

    dirname(path: string): string;

    basename(path: string): string;

    extname(path: string): string;

    isAbsolute(path: string): boolean;

    normalize(path: string): string;

    relative(from: string, to: string): string;

    toNamespacedPath(path: string): string;

    parse(pathString: string): ParsedPath;

    fromFileUrl(url: string | URL): string;

    toFileUrl(path: string): URL;
}

export interface IOperatingSystem {
    platform: OsFamily;
    isWindows: boolean;
    isLinux: boolean;
    isDarwin: boolean;
    arch: RuntimeArch;
    pathSeparator: string;
    directorySeparator: string;
    newLine: string;
}

export interface IProcess {
    readonly isElevated: boolean;

    cwd: string;

    readonly args: string[];

    run(...args: string[]): Promise<Result<PsOutput, Error>>;

    capture(...args: string[]): Promise<Result<PsOutput, Error>>;

    exec(exec: string, args?: string[], options?: IExecOptions): Promise<Result<PsOutput, Error>>;

    push(path: string): void;

    pop(): void;
}

export interface IFileSystem {
    chmod(path: string | URL, mode: number): Promise<void>;

    chown(path: string | URL, uid: number, gid: number): Promise<void>;

    readDirectory(path: string | URL): AsyncIterable<IDirectoryInfo>;

    rename(oldPath: string | URL, newPath: string | URL): Promise<void>;

    readTextFile(path: string | URL): Promise<string>;

    readLink(path: string | URL): Promise<string>;

    mkdir(path: string | URL, options?: ICreateDirectoryOptions | undefined): Promise<void>;

    makeDirectory(path: string | URL, options?: ICreateDirectoryOptions): Promise<void>;

    makeTempDirectory(options?: IMakeTempOptions): Promise<string>;

    makeTempFile(options?: IMakeTempOptions): Promise<string>;

    stat(path: string | URL): Promise<IFileInfo>;

    isDirectory(path: string | URL): Promise<boolean>;

    isDirectorySync(path: string | URL): boolean;

    isFile(path: string | URL): Promise<boolean>;

    isFileSync(path: string | URL): boolean;

    link(oldPath: string, newPath: string): Promise<void>;

    lstat(path: string | URL): Promise<IFileInfo>;

    exists(path: string): Promise<boolean>;

    existsSync(path: string): boolean;

    readFile(path: string | URL): Promise<Uint8Array>;

    remove(path: string | URL, options?: IRemoveOptions): Promise<void>;

    symlink(target: string | URL, path: string | URL, type?: ISymlinkOptions): Promise<void>;

    writeTextFile(path: string | URL, data: string): Promise<void>;

    writeFile(
        path: string | URL,
        data: Uint8Array | ReadableStream<Uint8Array>,
        options?: IWriteOptions | undefined,
    ): Promise<void>;
}

export interface IExecutionContext {
    readonly env: IEnv;
    readonly secrets: Map<string, string>;
    readonly outputs: Map<string, unknown>;
    readonly signal?: AbortSignal;
    readonly os: IOperatingSystem;
    readonly path: IPath;
    readonly fs: IFileSystem;
    readonly ps: IProcess;
}

export interface ITaskExecutionContext extends IExecutionContext {
    readonly task: ITask;
    readonly cwd: string;
}

export interface ITaskResult extends IRunnableResult {
    readonly outputs: Map<string, unknown>;
}

export interface IRunnableResult {
    status: "success" | "failure" | "skipped" | "cancelled";
}

export interface IRunnable<C extends IExecutionContext, R extends IRunnableResult> {
    readonly id: string;

    description?: string;

    timeout?: number;

    run(ctx: C): Promise<Result<R, Error>>;
}

export interface ITask extends IRunnable<ITaskExecutionContext, ITaskResult> {
    name: string;

    inputs?: Record<string, string>;

    workingDirectory?: string;
}

export interface ITaskBuilder {
    set(attributes: Partial<Omit<ITask, "id" | "run">>): ITaskBuilder;

    description(description: string): ITaskBuilder;

    timeout(timeout: number): ITaskBuilder;

    name(name: string): ITaskBuilder;
}

export interface ITaskCollection extends Iterable<ITask> {
    at(index: number): ITask;

    add(task: ITask): ITaskBuilder;

    size: number;

    get(id: string): ITask | undefined;

    has(id: string): boolean;

    addRange(tasks: Iterable<ITask>): void;
}

export interface IJobExecutionContext extends IExecutionContext {
    readonly name: string;
}

export interface IJobResult extends IRunnableResult {
    readonly outputs: Map<string, unknown>;
}

export interface IJob extends IRunnable<IJobExecutionContext, IJobResult> {
    tasks: ITaskCollection;

    deps: string[];

    name: string;
}

export interface IJobBuilder {
    set(attributes: Partial<Omit<IJob, "id" | "run">>): IJobBuilder;

    description(description: string): IJobBuilder;

    timeout(timeout: number): IJobBuilder;

    name(name: string): IJobBuilder;
}

export interface IJobCollection extends Iterable<IJob> {
    size: number;

    at(index: number): IJob;

    add(job: IJob): IJobBuilder;

    get(id: string): IJob | undefined;

    has(id: string): boolean;

    addRange(jobs: Iterable<IJob>): void;
}
