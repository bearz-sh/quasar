import { IDirectoryContents, IFileInfo, IFileProvider } from "./interfaces.ts";
import { exists } from "../../fs/mod.ts";
import { basename, isAbsolute, join } from "../../path/mod.ts";

export class PhyiscalFileProvider implements IFileProvider {
    #basePath: string;

    constructor(basePath: string) {
        this.#basePath = basePath;
    }

    async getFileInfo(path: string): Promise<IFileInfo> {
        if (!isAbsolute(path)) {
            path = join(this.#basePath, path);
        }

        const fileExists = await exists(path);
        if (!fileExists) {
            return {
                exists: false,
                length: 0,
                name: basename(path),
                physicalPath: path,
                lastModified: new Date(),
                isDirectory: false,
                createReadStream: () => {
                    const file = Deno.openSync(path, { read: true });
                    return file.readable;
                },
            };
        }

        const fileInfo = await Deno.stat(path);
        return {
            exists: true,
            length: fileInfo.size,
            name: basename(path),
            physicalPath: path,
            lastModified: fileInfo.mtime ?? undefined,
            isDirectory: fileInfo.isDirectory,
            createReadStream: () => {
                return Deno.openSync(path, { read: true }).readable;
            },
        };
    }

    async getDirectoryContents(path: string): Promise<IDirectoryContents> {
        if (!isAbsolute(path)) {
            path = join(this.#basePath, path);
        }

        const dirExists = await exists(path);
        if (!dirExists) {
            return {
                exitsts: false,
                [Symbol.asyncIterator]: async function* () {},
            };
        }

        return {
            exitsts: true,
            [Symbol.asyncIterator]: async function* () {
                for await (const entry of Deno.readDir(path)) {
                    const fileInfo = await Deno.stat(entry.name);
                    const mtime = fileInfo.mtime ?? undefined;
                    yield {
                        exists: true,
                        length: 0,
                        name: entry.name,
                        physicalPath: entry.name,
                        lastModified: mtime,
                        isDirectory: entry.isDirectory,
                        createReadStream: () => {
                            if (entry.isDirectory) {
                                throw new Error("Cannot create read stream for directory");
                            }

                            return Deno.openSync(entry.name, { read: true }).readable;
                        },
                    };
                }
            },
        };
    }
}
