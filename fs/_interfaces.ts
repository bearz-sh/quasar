export interface ISystemError extends Error {
    code: string;
    address?: string;
    dest?: string;
    errno?: number;
}

export interface IDirectoryInfo {
    name: string;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
}

export interface IRemoveOptions {
    recursive?: boolean;
}

export interface ICreateDirectoryOptions {
    recursive?: boolean;
    mode?: number;
}

 /**
   * Options which can be set when using {@linkcode Deno.makeTempDir},
   * {@linkcode Deno.makeTempDirSync}, {@linkcode Deno.makeTempFile}, and
   * {@linkcode Deno.makeTempFileSync}.
   *
   * @category File System */
 export interface IMakeTempOptions {
    /** Directory where the temporary directory should be created (defaults to
     * the env variable `TMPDIR`, or the system's default, usually `/tmp`).
     *
     * Note that if the passed `dir` is relative, the path returned by
     * `makeTempFile()` and `makeTempDir()` will also be relative. Be mindful of
     * this when changing working directory. */
    dir?: string;
    /** String that should precede the random portion of the temporary
     * directory's name. */
    prefix?: string;
    /** String that should follow the random portion of the temporary
     * directory's name. */
    suffix?: string;
  }

export interface ICopyOptions {
    overwrite?: boolean;
    preserveTimestamps?: boolean;
}

export interface IMoveOptions {
    overwrite?: boolean;
}

export interface IWriteOptions {
    append?: boolean;
    create?: boolean;
    signal?: AbortSignal;
    mode: number;
}

export interface IFileInfo {
    name: string;
    deviceId: number | null;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    size: number;
    createdAt: Date | null;
    modifiedAt: Date | null;
    lastAccessedAt: Date | null;
    userId: number | null;
    groupId: number | null;
    mode: number | null;
}

export interface IWriteJsonOptions extends IWriteOptions {
    spaces: number;
}

/** Options that can be used with {@linkcode symlink} and
 * {@linkcode symlinkSync}.
 *
 * @category File System */
export interface ISymlinkOptions {
    /** If the symbolic link should be either a file or directory. This option
     * only applies to Windows and is ignored on other operating systems. */
    type: "file" | "dir";
}