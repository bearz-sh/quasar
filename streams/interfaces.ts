/**
 * A enum which defines the seek mode for IO related APIs that support
 * seeking.
 *
 * @category I/O */
 export enum SeekMode {
    /* Seek from the start of the file/resource. */
    Start = 0,
    /* Seek from the current position within the file/resource. */
    Current = 1,
    /* Seek from the end of the current file/resource. */
    End = 2,
}



/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer asynchronously.
 *
 * @category I/O */
export interface IReader {
    /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number of
     * bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
     * encountered. Even if `read()` resolves to `n` < `p.byteLength`, it may
     * use all of `p` as scratch space during the call. If some data is
     * available but not `p.byteLength` bytes, `read()` conventionally resolves
     * to what is available instead of waiting for more.
     *
     * When `read()` encounters end-of-file condition, it resolves to EOF
     * (`null`).
     *
     * When `read()` encounters an error, it rejects with an error.
     *
     * Callers should always process the `n` > `0` bytes returned before
     * considering the EOF (`null`). Doing so correctly handles I/O errors that
     * happen after reading some bytes and also both of the allowed EOF
     * behaviors.
     *
     * Implementations should not retain a reference to `p`.
     *
     * Use
     * [`itereateReader`](https://deno.land/std/streams/iterate_reader.ts?s=iterateReader)
     * from
     * [`std/streams/iterate_reader.ts`](https://deno.land/std/streams/iterate_reader.ts)
     * to turn a `Reader` into an {@linkcode AsyncIterator}.
     */
    read(p: Uint8Array): Promise<number | null>;
}

/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer synchronously.
 *
 * @category I/O */
export interface IReaderSync {
    /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number
     * of bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
     * encountered. Even if `readSync()` returns `n` < `p.byteLength`, it may use
     * all of `p` as scratch space during the call. If some data is available
     * but not `p.byteLength` bytes, `readSync()` conventionally returns what is
     * available instead of waiting for more.
     *
     * When `readSync()` encounters end-of-file condition, it returns EOF
     * (`null`).
     *
     * When `readSync()` encounters an error, it throws with an error.
     *
     * Callers should always process the `n` > `0` bytes returned before
     * considering the EOF (`null`). Doing so correctly handles I/O errors that
     * happen after reading some bytes and also both of the allowed EOF
     * behaviors.
     *
     * Implementations should not retain a reference to `p`.
     *
     * Use
     * [`itereateReaderSync`](https://deno.land/std/streams/iterate_reader.ts?s=iterateReaderSync)
     * from from
     * [`std/streams/iterate_reader.ts`](https://deno.land/std/streams/iterate_reader.ts)
     * to turn a `ReaderSync` into an {@linkcode Iterator}.
     */
    readSync(p: Uint8Array): number | null;
}

/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource asynchronously.
 *
 * @category I/O */
export interface IWriter {
    /** Writes `p.byteLength` bytes from `p` to the underlying data stream. It
     * resolves to the number of bytes written from `p` (`0` <= `n` <=
     * `p.byteLength`) or reject with the error encountered that caused the
     * write to stop early. `write()` must reject with a non-null error if
     * would resolve to `n` < `p.byteLength`. `write()` must not modify the
     * slice data, even temporarily.
     *
     * This function is one of the lowest
     * level APIs and most users should not work with this directly, but rather use
     * [`writeAll()`](https://deno.land/std/streams/write_all.ts?s=writeAll) from
     * [`std/streams/write_all.ts`](https://deno.land/std/streams/write_all.ts)
     * instead.
     *
     * Implementations should not retain a reference to `p`.
     */
    write(p: Uint8Array): Promise<number>;
}

/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource synchronously.
 *
 * @category I/O */
export interface IWriterSync {
    /** Writes `p.byteLength` bytes from `p` to the underlying data
     * stream. It returns the number of bytes written from `p` (`0` <= `n`
     * <= `p.byteLength`) and any error encountered that caused the write to
     * stop early. `writeSync()` must throw a non-null error if it returns `n` <
     * `p.byteLength`. `writeSync()` must not modify the slice data, even
     * temporarily.
     *
     * Implementations should not retain a reference to `p`.
     */
    writeSync(p: Uint8Array): number;
}

/**
 * An abstract interface which when implemented provides an interface to close
 * files/resources that were previously opened.
 *
 * @category I/O */
export interface ICloser {
    /** Closes the resource, "freeing" the backing file/resource. */
    close(): void;
}

/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource asynchronously.
 *
 * @category I/O */
export interface ISeeker {
    /** Seek sets the offset for the next `read()` or `write()` to offset,
     * interpreted according to `whence`: `Start` means relative to the
     * start of the file, `Current` means relative to the current offset,
     * and `End` means relative to the end. Seek resolves to the new offset
     * relative to the start of the file.
     *
     * Seeking to an offset before the start of the file is an error. Seeking to
     * any positive offset is legal, but the behavior of subsequent I/O
     * operations on the underlying object is implementation-dependent.
     *
     * It resolves with the updated offset.
     */
    seek(offset: number | bigint, whence: SeekMode): Promise<number>;
}

/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource synchronously.
 *
 * @category I/O */
export interface ISeekerSync {
    /** Seek sets the offset for the next `readSync()` or `writeSync()` to
     * offset, interpreted according to `whence`: `Start` means relative
     * to the start of the file, `Current` means relative to the current
     * offset, and `End` means relative to the end.
     *
     * Seeking to an offset before the start of the file is an error. Seeking to
     * any positive offset is legal, but the behavior of subsequent I/O
     * operations on the underlying object is implementation-dependent.
     *
     * It returns the updated offset.
     */
    seekSync(offset: number | bigint, whence: SeekMode): number;
}