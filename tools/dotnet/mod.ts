// deno-lint-ignore-file no-unused-vars
import { NEW_LINE } from "../../os/constants.ts";
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";
import { PsOutput } from "../../process/ps.ts";
import { get } from "../../os/env.ts";
import { IPkgInfo, IPkgMgr, pkgmgrs } from "../pkgmgr.ts";

registerExe("dotnet", {
    windows: [
        "%ProgramFiles%\\dotnet\\dotnet.exe",
    ]
});

export function dotnet(args?: string[], options?: IExecOptions) {
    return exec("dotnet", args, options);
}

dotnet.cli = dotnet;
dotnet.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("dotnet", args, options);
}

export interface IDotNetToolInfo extends IPkgInfo {
    command?: string;
    authors?: string;
    downloads?: number;
    verified?: boolean;
}

export class DotNetToolManager implements IPkgMgr {
    readonly name: string = "dotnet-tools";

    install(name: string, version?: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const splat = ["tool", "install", name];

        if (version)
            splat.push("--version", version);

        let addGlobal = args === undefined || !args.length;
        if (args?.length) {
            addGlobal = !args.includes("--global") && !args.includes("-g") && !args.includes("--local") && !args.includes("--tool-path");
            splat.push(...args);
        }

        if (addGlobal)
           splat.push("--global");

        return dotnet(splat, options);
    }
 
    uninstall(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const splat = ["tool", "uninstall", name];


        let addGlobal = args === undefined || !args.length;
        if (args?.length) {
            addGlobal = !args.includes("--global") && !args.includes("-g") && !args.includes("--local") && !args.includes("--tool-path");
            splat.push(...args);
        }

        if (addGlobal)
           splat.push("--global");

        return dotnet(splat, options);
    }
 
    upgrade(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const splat = ["tool", "update", name];

        let addGlobal = args === undefined || !args.length;
        if (args?.length) {
            addGlobal = !args.includes("--global") && !args.includes("-g") && !args.includes("--local") && !args.includes("--tool-path");
            splat.push(...args);
        }

        if (addGlobal)
           splat.push("--global");

        return dotnet(splat, options);
    }
 
    async list(query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        const splat = ["tool", "list"]

        if (query)
            splat.push(query);

        let addGlobal = args === undefined || !args.length;
        if (args?.length) {
            addGlobal = !args.includes("--global") && !args.includes("-g") && !args.includes("--local") && !args.includes("--tool-path");
            splat.push(...args);
        }

        if (addGlobal)
           splat.push("--global");

        options = options ?? {};
        options.stdout = "piped";
        options.stderr = "piped";

        const out = await dotnet(splat, options);
        out.throwOrContinue();
        const lines = out.stdoutAsLines;
        const results : IDotNetToolInfo[] = [];
        for(let i = 2; i < lines.length; i++) {
            const line = lines[i]
            const parts = line.split(" ").filter(p => p.length > 0);
            if (parts.length === 3) {
                const name = parts[0];
                const version = parts[1];
                const command = parts[2];
                results.push({ name, version, command });
            }
        }

        return results;
    }

    async search(query?: string,args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        const splat = ["tool", "search"]

        if (query)
            splat.push(query);

        
        if (args?.length) {
            splat.push(...args);
        }

        options = options ?? {};
        options.stdout = "piped";
        options.stderr = "piped";

        const out = await dotnet(splat, options);
        out.throwOrContinue();
        const lines = out.stdoutAsLines;
        const results : IDotNetToolInfo[] = [];
        for(let i = 2; i < lines.length; i++) {
            const line = lines[i]
            const parts = line.split(" ").filter(p => p.length);
            if (parts.length > 3) {
                const name = parts[0];
                const version = parts[1];
                const authors = parts[2];
                const downloads = parts[3];
                let verified = false;
                if (parts.length === 5)
                    verified = parts[4] === "x";
                results.push({ name, version, authors, downloads: parseInt(downloads), verified });
            }
        }

        return results;
    }
}

export class DotNetNugetManager implements IPkgMgr {
    readonly name: string = "dotnet-nuget";

    install(name: string, version?: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const project = get("DOTNET_PROJECT") ?? cwd();
        
        const splat = ["add", project, "package", name];

        if (version)
            splat.push("--version", version);

        if (args?.length) {
            splat.push(...args);
        }

        return dotnet(splat, options);
    }
 
    uninstall(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        const project = get("DOTNET_PROJECT") ?? cwd();
        
        const splat = ["remove", project, "package", name];

        if (args?.length) {
            splat.push(...args);
        }

        return dotnet(splat, options);
    }
 
    upgrade(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput> {
        throw new Error("Method not implemented.");
    }
 
    list(query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        const project = get("DOTNET_PROJECT") ?? cwd();
        
        const splat = ["list", project, "package"];

        if (args?.length) {
            splat.push(...args);
        }

        return dotnet(splat, options);
    }

    search(query: string,args?: string[], options?: IExecOptions): Promise<IPkgInfo[]> {
        throw new Error("Method not implemented.");
    }
}

pkgmgrs.set("dotnet-tools", new DotNetToolManager());
pkgmgrs.set("dotnet-nuget", new DotNetNugetManager());