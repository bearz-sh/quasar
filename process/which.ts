import * as env from '../os/env.ts';
import { basename, basenameWithoutExtension, isAbsolute, join, resolve } from '../path/mod.ts';
import {
    IDirectoryInfo,
    isDirectory,
    isDirectorySync,
    isFile,
    isFileSync,
    readDirectory,
    readDirectorySync,
} from '../fs/mod.ts';
import { IS_WINDOWS as isWindows } from '../os/constants.ts';
import { isNullOrEmpty, isNullOrWhiteSpace } from '../str.ts';
import { notNull, notNullOrWhiteSpace } from '../check/mod.ts';

const executableCache: { [key: string]: string | undefined } = {};

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export function whichSync(
    fileName: string,
    prependPath?: string[],
    useCache = true,
): string | undefined {
    notNullOrWhiteSpace(fileName, 'fileName');
    notNull(env, 'env');

    const rootName = basenameWithoutExtension(fileName);
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && isFileSync(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.split()
        .filter((segment) => segment.length > 0)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

        pathExtSegments = pathExtensions.split(';')
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment) || !isDirectorySync(pathSegment)) {
            continue;
        }

        if (isWindows) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (hasPathExt) {
                try {
                    let first : IDirectoryInfo | undefined;
                    for(const entry of readDirectorySync(pathSegment)) {
                        if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    let first : IDirectoryInfo | undefined;
                    for(const entry of readDirectorySync(pathSegment)) {
                        if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                let first : IDirectoryInfo | undefined;
                for(const entry of readDirectorySync(pathSegment)) {
                    if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export async function which(
    fileName: string,
    prependPath?: string[],
    useCache = true,
): Promise<string | undefined> {
    notNullOrWhiteSpace(fileName, 'fileName');
    notNull(env, 'env');

    const rootName = basenameWithoutExtension(fileName);
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && await isFile(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.split()
        .filter((segment) => segment.length > 0)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

        pathExtSegments = pathExtensions.split(';')
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment)) {
            continue;
        }

        const isDir = await isDirectory(pathSegment);
        if (!isDir) {
            continue;
        }

        if (isWindows) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (hasPathExt) {
                try {
                   
                    let first : IDirectoryInfo | undefined;
                    for await(const entry of readDirectory(pathSegment)) {
                        if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    let first : IDirectoryInfo | undefined;
                    for await(const entry of readDirectory(pathSegment)) {
                        if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                let first : IDirectoryInfo | undefined;
                for await(const entry of readDirectory(pathSegment)) {
                    if(entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}
