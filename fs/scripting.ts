import {
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IMakeTempOptions,
    IRemoveOptions,
    ISymlinkOptions,
    IWriteOptions,
} from "./_interfaces.ts";
import * as fs2 from "./fs.ts";

export interface IFileSystem {
    chmod(path: string | URL, mode: number): Promise<void>;

    chown(path: string | URL, uid: number, gid: number): Promise<void>;

    copy(src: string | URL, dest: string | URL): Promise<void>;

    copySync(src: string | URL, dest: string | URL): void;

    emptyDirectory(path: string | URL): Promise<void>;

    emptyDirectorySync(path: string | URL): void;

    ensureFile(path: string | URL): Promise<void>;

    ensureFileSync(path: string | URL): void;

    ensureDirectory(path: string | URL): Promise<void>;

    ensureDirectorySync(path: string | URL): void;

    expandGlob(
        glob: string | URL,
        { root, exclude, includeDirs, extended, globstar, caseInsensitive, followSymlinks }?: fs2.ExpandGlobOptions,
    ): AsyncIterableIterator<fs2.WalkEntry>;

    expandGlobSync(
        glob: string | URL,
        { root, exclude, includeDirs, extended, globstar, caseInsensitive, followSymlinks }?: fs2.ExpandGlobOptions,
    ): IterableIterator<fs2.WalkEntry>;

    exists(path: string): Promise<boolean>;

    existsSync(path: string): boolean;

    readDirectory(path: string | URL): AsyncIterable<IDirectoryInfo>;

    readDirectorySync(path: string | URL): Iterable<IDirectoryInfo>;

    rename(oldPath: string | URL, newPath: string | URL): Promise<void>;

    renameSync(oldPath: string | URL, newPath: string | URL): void;

    readTextFile(path: string | URL): Promise<string>;

    readLink(path: string | URL): Promise<string>;

    mkdir(path: string | URL, options?: ICreateDirectoryOptions | undefined): Promise<void>;

    makeDirectory(path: string | URL, options?: ICreateDirectoryOptions): Promise<void>;

    makeTempDirectory(options?: IMakeTempOptions): Promise<string>;

    makeTempDirectorySync(options?: IMakeTempOptions): string;

    makeTempFile(options?: IMakeTempOptions): Promise<string>;

    makeTempFileSync(options?: IMakeTempOptions): string;

    move(src: string | URL, dest: string | URL): Promise<void>;

    moveSync(src: string | URL, dest: string | URL): void;

    stat(path: string | URL): Promise<IFileInfo>;

    statSync(path: string | URL): IFileInfo;

    isDirectory(path: string | URL): Promise<boolean>;

    isDirectorySync(path: string | URL): boolean;

    isFile(path: string | URL): Promise<boolean>;

    isFileSync(path: string | URL): boolean;

    link(oldPath: string, newPath: string): Promise<void>;

    linkSync(oldPath: string, newPath: string): void;

    lstat(path: string | URL): Promise<IFileInfo>;

    lstatSync(path: string | URL): IFileInfo;

    readFile(path: string | URL): Promise<Uint8Array>;

    readFileSync(path: string | URL): Uint8Array;

    remove(path: string | URL, options?: IRemoveOptions): Promise<void>;

    removeSync(path: string | URL, options?: IRemoveOptions): void;

    symlink(target: string | URL, path: string | URL, type?: ISymlinkOptions): Promise<void>;

    symlinkSync(target: string | URL, path: string | URL, type?: ISymlinkOptions): void;

    writeTextFile(path: string | URL, data: string): Promise<void>;

    writeTextFileSync(path: string | URL, data: string): void;

    writeFile(
        path: string | URL,
        data: Uint8Array | ReadableStream<Uint8Array>,
        options?: IWriteOptions | undefined,
    ): Promise<void>;

    writeFileSync(
        path: string | URL,
        data: Uint8Array | ReadableStream<Uint8Array>,
        options?: IWriteOptions | undefined,
    ): void;
}

export const fs: IFileSystem = fs2;
