import {
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IMakeTempOptions,
    IRemoveOptions,
    ISymlinkOptions,
    IWriteOptions,
} from "../fs/_interfaces.ts";
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

    run(...args: string[]): Promise<PsOutput>;

    runSync(...args: string[]): PsOutput;

    capture(...args: string[]): Promise<PsOutput>;

    captureSync(...args: string[]): PsOutput;

    exec(exec: string, args?: string[], options?: IExecOptions): Promise<PsOutput>;

    execSync(exec: string, args?: string[], options?: IExecOptions): PsOutput;

    isatty(rid: number): boolean;

    push(path: string): void;

    pop(): void;

    exit(code?: number): void;
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

export type TaskRun = (state?: Map<string, unknown>, signal?: AbortSignal) => Promise<void>;

export interface ITask {
    id: string;
    name: string;
    description?: string;
    deps: string[];
    timeout?: number;
    force?: boolean;
    skip?: boolean | (() => Promise<boolean>);
    run(state?: Map<string, unknown>, signal?: AbortSignal): Promise<void>;
}

export interface ITaskBuilder {
    set(attributes: Partial<Omit<ITask, "id" | "run">>): ITaskBuilder;
    description(description: string): ITaskBuilder;
    timeout(timeout: number): ITaskBuilder;
    name(name: string): ITaskBuilder;
    skip(skip: boolean | (() => Promise<boolean>)): ITaskBuilder;
    deps(...deps: string[]): ITaskBuilder;
}

export interface ITaskCollection {
    size: number;
    add(task: ITask): ITaskBuilder;
    addRange(tasks: Iterable<ITask>): void;
    at(index: number): ITask;
    get(id: string): ITask | undefined;
    has(id: string): boolean;
}
