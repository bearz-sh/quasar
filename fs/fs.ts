import {
    IFileInfo,
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IRemoveOptions,
    IWriteOptions,
    ISymlinkOptions,
IMakeTempOptions
} from './_interfaces.ts';


export function isDirectory(path: string | URL) : Promise<boolean> {
    return Deno.stat(path).then(stat => stat.isDirectory);
}

export function isDirectorySync(path: string | URL) : boolean {
    return Deno.statSync(path).isDirectory;
}

export function isFile(path: string | URL) : Promise<boolean> {
    return Deno.stat(path).then(stat => stat.isFile);
}

export function isFileSync(path: string | URL) : boolean {
    return Deno.statSync(path).isFile;
}

export function link(oldPath: string, newPath: string) : Promise<void> {
    return Deno.link(oldPath, newPath);
}

export function linkSync(oldPath: string, newPath: string) : void {
    Deno.linkSync(oldPath, newPath);
}

export function lstat(path: string | URL) : Promise<IFileInfo> {
    return Deno.lstat(path).then(stat => {
        const name = path instanceof URL ? path.toString() : path;
        return {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
            name: name,
            size: stat.size,
            createdAt: stat.birthtime,
            modifiedAt: stat.mtime,
            lastAccessedAt: stat.atime,
            mode: stat.mode,
            userId: stat.uid,
            groupId: stat.gid,
            deviceId: stat.dev
        }
    });
}

export function lstatSync(path: string | URL) : IFileInfo {
    const stat = Deno.lstatSync(path);
    const name = path instanceof URL ? path.toString() : path;
    return {
        isFile: stat.isFile,
        isDirectory: stat.isDirectory,
        isSymlink: stat.isSymlink,
        name: name,
        size: stat.size,
        createdAt: stat.birthtime,
        modifiedAt: stat.mtime,
        lastAccessedAt: stat.atime,
        mode: stat.mode,
        userId: stat.uid,
        groupId: stat.gid,
        deviceId: stat.dev
    }
}

export function chmod(path: string | URL, mode: number) : Promise<void> {
    return Deno.chmod(path, mode);
}

export function chmodSync(path: string | URL, mode: number) : void {
    Deno.chmodSync(path, mode);
}

export function chown(path: string | URL, uid: number, gid: number) : Promise<void> {
    return Deno.chown(path, uid, gid);
}

export function chownSync(path: string | URL, uid: number, gid: number) : void {
    Deno.chownSync(path, uid, gid);
}

export function makeDirectory(path: string | URL, options?: ICreateDirectoryOptions) : Promise<void> {
    return Deno.mkdir(path, options);
}

export function makeDirectorySync(path: string | URL, options?: ICreateDirectoryOptions) : void {
    Deno.mkdirSync(path, options);
}

export function makeTempDirectorySync(options?: IMakeTempOptions) : string {
    return Deno.makeTempDirSync(options);
}

export function makeTempDirectory(options?: IMakeTempOptions) : Promise<string> {
    return Deno.makeTempDir(options);
}

export function makeTempFileSync(options?: IMakeTempOptions) : string {
    return Deno.makeTempFileSync(options);
}

export function makeTempFile(options?: IMakeTempOptions) : Promise<string> {
    return Deno.makeTempFile(options);
}

export function mkdir(path: string | URL, options?: ICreateDirectoryOptions | undefined) : Promise<void> {
    return Deno.mkdir(path, options);
}

export function mkdirSync(path: string | URL, options?: ICreateDirectoryOptions | undefined) : void {
    Deno.mkdirSync(path, options);
}

export function stat(path: string | URL) : Promise<IFileInfo> {
    return Deno.stat(path).then(stat => {
        const name = path instanceof URL ? path.toString() : path;
        return {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
            name: name,
            size: stat.size,
            createdAt: stat.birthtime,
            modifiedAt: stat.mtime,
            lastAccessedAt: stat.atime,
            mode: stat.mode,
            userId: stat.uid,
            groupId: stat.gid,
            deviceId: stat.dev
        }
    });
}

export function statSync(path: string | URL) : IFileInfo {
    const stat = Deno.statSync(path);
    const name = path instanceof URL ? path.toString() : path;
    return {
        isFile: stat.isFile,
        isDirectory: stat.isDirectory,
        isSymlink: stat.isSymlink,
        name: name,
        size: stat.size,
        createdAt: stat.birthtime,
        modifiedAt: stat.mtime,
        lastAccessedAt: stat.atime,
        mode: stat.mode,
        userId: stat.uid,
        groupId: stat.gid,
        deviceId: stat.dev
    }
}

export function readdir(path: string | URL) : AsyncIterable<IDirectoryInfo> {
    return Deno.readDir(path);
}

export function readdirSync(path: string | URL) : Iterable<IDirectoryInfo> {
    return Deno.readDirSync(path);
}

export function readDirectory(path: string | URL) : AsyncIterable<IDirectoryInfo> {
    return Deno.readDir(path);
}

export function readDirectorySync(path: string | URL) : Iterable<IDirectoryInfo> {
    return Deno.readDirSync(path);
}

export function readLink(path: string | URL) : Promise<string> {
    return Deno.readLink(path);
}

export function readLinkSync(path: string | URL) : string {
    return Deno.readLinkSync(path);
}

export function readTextFileSync(path: string | URL) : string {
    return Deno.readTextFileSync(path);
}

export function readTextFile(path: string | URL) : Promise<string> {
    return Deno.readTextFile(path);
}

export function readFile(path: string | URL) : Promise<Uint8Array> {
    return Deno.readFile(path);
}

export function readFileSync(path: string | URL) : Uint8Array {
    return Deno.readFileSync(path);
}

export function rename(oldPath: string | URL, newPath: string | URL) : Promise<void> {
    return Deno.rename(oldPath, newPath);
}

export function renameSync(oldPath: string | URL, newPath: string | URL) : void {
    Deno.renameSync(oldPath, newPath);
}

export function rm(path: string | URL, options?: IRemoveOptions) : Promise<void> {
    return Deno.remove(path, options);
}

export function rmSync(path: string | URL, options?: IRemoveOptions) : void {
    Deno.removeSync(path, options);
}

export function remove(path: string | URL, options?: IRemoveOptions) : Promise<void> {
    return Deno.remove(path, options);
}

export function removeSync(path: string | URL, options?: IRemoveOptions) : void {
    return Deno.removeSync(path, options);
}

export function symlink(target: string | URL, path: string | URL, type?: ISymlinkOptions) : Promise<void> {
    return Deno.symlink(target, path, type);
}

export function symlinkSync(target: string | URL, path: string | URL, type?: ISymlinkOptions) : void {
    Deno.symlinkSync(target, path, type);
}

export function writeTextFileSync(path: string | URL, data: string) : void {
    Deno.writeTextFileSync(path, data);
}

export function writeTextFile(path: string | URL, data: string) : Promise<void> {
    return Deno.writeTextFile(path, data);
}

export function writeFile(
    path: string | URL, 
    data: Uint8Array | ReadableStream<Uint8Array>, 
    options?: IWriteOptions | undefined) : Promise<void> {
    return Deno.writeFile(path, data, options);
}

export function writeFileSync(
    path: string | URL, 
    data: Uint8Array, 
    options?: IWriteOptions | undefined) : void {
    return Deno.writeFileSync(path, data, options);
}

export function utime(path: string | URL, atime: number | Date, mtime: number | Date) : Promise<void> {
    return Deno.utime(path, atime, mtime);
}

export function utimeSync(path: string | URL, atime: number | Date, mtime: number | Date) : void {
    Deno.utimeSync(path, atime, mtime);
}