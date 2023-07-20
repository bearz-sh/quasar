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

registerExe("dotnet", {
    windows: [
        "%ProgramFiles%\\dotnet\\dotnet.exe",
    ]
});

export function dotnet(args?: string[], options?: IExecOptions) {
    return exec("dotnet", args, options);
}

dotnet.cli = dotnet;
dotnet.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("dotnet", args, options);
}

export class DotNetToolManager implements IPkgMgr {
    readonly name: string = "dotnet-tools";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        throw new Error("Method not implemented.");
    }
 
    uninstall(name: string, args?: string[]): Promise<PsOutput> {
         throw new Error("Method not implemented.");
    }
 
    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        throw new Error("Method not implemented.");
    }
 
    list(query: string, args?: string[]): Promise<IPkgInfo[]> {
        throw new Error("Method not implemented.");
    }

    search(query: string,args?: string[]): Promise<IPkgInfo[]> {
        throw new Error("Method not implemented.");
    }
}

export class DotNetNugetManager implements IPkgMgr {
    readonly name: string = "dotnet-nuget";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        throw new Error("Method not implemented.");
    }
 
    uninstall(name: string, args?: string[]): Promise<PsOutput> {
         throw new Error("Method not implemented.");
    }
 
    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        throw new Error("Method not implemented.");
    }
 
    list(query: string, args?: string[]): Promise<IPkgInfo[]> {
        throw new Error("Method not implemented.");
    }

    search(query: string,args?: string[]): Promise<IPkgInfo[]> {
        throw new Error("Method not implemented.");
    }
}

pkgmgrs.set("dotnet-tools", new DotNetToolManager());
pkgmgrs.set("dotnet-nuget", new DotNetNugetManager());