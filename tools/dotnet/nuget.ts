// deno-lint-ignore-file no-unused-vars
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";
import { PsOutput } from "../../process/ps.ts";
import { IPkgInfo, IPkgMgr, pkgmgrs } from "../pkgmgr.ts";
import { get } from "../../os/env.ts";

registerExe("nuget", {
    windows: [
        "%ChocolateyInstall%\\bin\\nuget.exe",
    ]
});

export function nuget(args?: string[], options?: IExecOptions) {
    return exec("nuget", args, options);
}

nuget.cli = nuget;
nuget.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("nuget", args, options);
}

export class NugetManager implements IPkgMgr {
    readonly name: string = "nuget";

    install(name: string, version?: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const splat = ["install", name];

        const msBuildPath = get("MSBUILD_PATH");
        if (msBuildPath && args && !args.includes("-MSBuildPath"))
            splat.push("-MSBuildPath", msBuildPath);
        
        if (version)
            splat.push("-Version", version);

        if (args?.length)
            splat.push(...args);

        return nuget(splat, options);
    }
 
    uninstall(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        // TODO: implement with file removal
        throw new Error("Method not implemented.");
    }
 
    upgrade(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const splat = ["update"];

        const msBuildPath = get("MSBUILD_PATH");
        if (msBuildPath && args && !args.includes("-MSBuildPath"))
            splat.push("-MSBuildPath", msBuildPath);
        
        if (version)
            splat.push("-Version", version);

        if (args?.length)
            splat.push(...args);

        return nuget(splat, options);
    }
 
    list(query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        const splat = ["list"];

        if (query)
            splat.push(query);

        if (args?.length)
            splat.push(...args);

        options = options || {};
        options.stdout = "piped";
        options.stderr = "piped";

        const out = await nuget(splat, options);
        const result : IPkgInfo[] = [];
        const lines = out.stdoutAsLines;
        for(var i = 0; i < lines.length; i++) {
        {
            const line = lines[i];
            const parts = line.split(" ").filter(p => p.length);
            if (parts.length < 2)
                continue;

            const name = parts[0];
            const version = parts[1];
            result.push({ name, version });
        }

        return parts;
    }

    search(query: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        const splat = ["search"];

        if (query)
            splat.push(query);

        if (args?.length)
            splat.push(...args);

        options = options || {};
        options.stdout = "piped";
        options.stderr = "piped";

        const out = await nuget(splat, options);
        const result : IPkgInfo[] = [];
        const lines = out.stdoutAsLines;
        for(var i = 2; i < lines.length; i++) {
        {
            const line = lines[i];
            const parts = line.split(" ").filter(p => p.length && p !== '>' && p !== '|');
            if (parts.length < 2)
                continue;
                
            const name = parts[0];
            const version = parts[1];
            result.push({ name, version });
        }

        return parts;
    }
}

pkgmgrs.set("nuget", new NugetManager());