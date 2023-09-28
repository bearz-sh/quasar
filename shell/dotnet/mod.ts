import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions } from "../core/mod.ts";
import {
    DotNetBuildConfig,
    IDotNetBuildArgs,
    IDotNetCleanArgs,
    IDotNetRestoreArgs,
    IDotNetTestArgs,
} from "./interfaces.ts";
import { getOrDefault } from "../../os/env.ts";
import { isCi } from "../../ci/constants.ts";
import { splat } from "../../mod.ts";

export function dotnet(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function dotnetSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}

let buildConfigValue: DotNetBuildConfig | string | undefined;
let defaultProjectPath: string | undefined = undefined;

function buildConfig(value?: DotNetBuildConfig | string) {
    if (value) {
        buildConfigValue = value;
        return buildConfigValue;
    }

    if (!buildConfigValue) {
        buildConfigValue = getOrDefault("DOTNET_CONFIG", isCi ? "Release" : "Debug");
    }

    return buildConfigValue;
}

function defaultProject(value?: string) {
    if (value) {
        defaultProjectPath = value;
        return defaultProjectPath;
    }

    if (!defaultProjectPath) {
        defaultProjectPath = getOrDefault("DOTNET_PROJECT", ".");
    }

    return defaultProjectPath;
}

export function restore(args?: IDotNetRestoreArgs, options?: IExecOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();

    const params = splat(o, {
        command: ["restore"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnet(params, options);
}

export function restorySync(args?: IDotNetRestoreArgs, options?: IExecSyncOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();

    const params = splat(o, {
        command: ["restore"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnetSync(params, options);
}

export function clean(args?: IDotNetCleanArgs, options?: IExecOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();

    const params = splat(o, {
        command: ["clean"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnet(params, options);
}

export function cleanSync(args?: IDotNetCleanArgs, options?: IExecSyncOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();

    const params = splat(o, {
        command: ["clean"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnetSync(params, options);
}

export function build(args?: IDotNetBuildArgs, options?: IExecOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();
    o.configuration ??= buildConfig();

    if (isCi && o.noRestore === undefined) {
        o.noRestore = true;
    }

    const params = splat(o, {
        command: ["build"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnet(params, options);
}

export function buildSync(args?: IDotNetBuildArgs, options?: IExecSyncOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();
    o.configuration ??= buildConfig();

    if (isCi && o.noRestore === undefined) {
        o.noRestore = true;
    }

    const params = splat(o, {
        command: ["build"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnetSync(params, options);
}

export function test(args?: IDotNetTestArgs, options?: IExecOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();
    o.configuration ??= buildConfig();

    if (isCi && o.noBuild === undefined) {
        o.noBuild = true;
    }

    const params = splat(o, {
        command: ["test"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnet(params, options);
}

export function testSync(args?: IDotNetTestArgs, options?: IExecSyncOptions) {
    const o = args ?? {};
    o.project ??= defaultProject();
    o.configuration ??= buildConfig();

    if (isCi && o.noBuild === undefined) {
        o.noBuild = true;
    }

    const params = splat(o, {
        command: ["test"],
        prefix: "--",
        arguments: ["project"],
    });
    return dotnetSync(params, options);
}
