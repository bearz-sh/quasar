import { get } from "../os/env.ts";
import { fromFileUrl, join } from "../path/mod.ts";
import { cwd } from "../process/mod.ts";
// function state
let rootDirPath: string | undefined = undefined;
let artifactsDirPath: string | undefined = undefined;

export function rootDir(path?: string | URL): string {
    if (path) {
        if (path instanceof URL) {
            path = fromFileUrl(path);
        }

        artifactsDirPath = path;
        return artifactsDirPath;
    }

    if (!rootDirPath) {
        const vars: string[] = [
            "GITHUB_WORKSPACE",
            "SYSTEM_DEFAULTWORKINGDIRECTORY",
            "BUILD_SOURCESDIRECTORY",
            "CI_PROJECT_DIR",
            "WORKSPACE",
            "CI_WORKSPACE",
        ];

        for (const v of vars) {
            const p = get(v);
            if (p) {
                rootDirPath = p;
                return rootDirPath;
            }
        }

        rootDirPath = cwd();
        return rootDirPath;
    }

    return rootDirPath;
}

export function artifactsDir(path?: string | URL) {
    if (path) {
        if (path instanceof URL) {
            path = fromFileUrl(path);
        }

        artifactsDirPath = path;
        return artifactsDirPath;
    }

    if (artifactsDirPath) {
        return artifactsDirPath;
    }

    const vars: string[] = [
        "BUILD_ARTIFACTSTAGINGDIRECTORY",
        "CI_ARTIFACTS_DIR",
    ];

    for (const v of vars) {
        const p = get(v);
        if (p) {
            artifactsDirPath = p;
            return artifactsDirPath;
        }
    }

    const root = rootDir();
    artifactsDirPath = join(root, ".artifacts");
    return artifactsDirPath;
}
