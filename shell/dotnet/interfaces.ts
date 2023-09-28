export type DotNetBuildConfig = "Release" | "Debug";

export interface IDotNetArgs extends Record<string, unknown> {
    nologo?: boolean;
}

export interface IDotNetRestoreArgs extends IDotNetArgs {
    project?: string;
    source?: string[];
    disableParallel?: boolean;
    force?: boolean;
    ignoreFailedSources?: boolean;
    noCache?: boolean;
    packages?: string;
    runtime?: string;
    verbosity?: string;
    configfile?: string;
    interactive?: boolean;
    lockfileonly?: boolean;
    lockedmode?: boolean;
    noDependencies?: boolean;
    useLockFile?: boolean;
    ignoreProjectToProjectReferences?: boolean;
    noRestore?: boolean;
}

export type DotNetVerbosity = "q" | "m" | "n" | "d" | "diag";

export interface IDotNetCleanArgs extends IDotNetProjectArgs {
    project?: string;
    output?: string;
    verbosity?: DotNetVerbosity;
    force?: boolean;
}

export interface IDotNetProjectArgs extends IDotNetArgs {
    project?: string;
    configuration?: DotNetBuildConfig | string;
    framework?: string;
    runtime?: string;
}

export interface IDotNetOsProjectArgs extends IDotNetProjectArgs {
    os?: string;
    arch?: string;
}

export interface IDotNetBuildArgs extends IDotNetOsProjectArgs {
    noIncremental?: boolean;
    noDependencies?: boolean;
    noRestore?: boolean;
    verbosity?: DotNetVerbosity;
    ignoreWarnings?: string[];
    noWarn?: string[];
    warnAsError?: string[];
    warnAsMessage?: string[];
    noBuild?: boolean;
    noDeploy?: boolean;
    force?: boolean;
    output?: string;
    versionSuffix?: string;
    properties?: Record<string, string>;
}

export interface IDotNetTestArgs extends IDotNetOsProjectArgs {
    environment?: string[];
    listTests?: boolean;
    settings?: string;
    filter?: string;
    noBuild?: boolean;
    noRestore?: boolean;
    output?: string;
    resultsDirectory?: string;
}
