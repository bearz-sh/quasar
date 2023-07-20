// deno-lint-ignore-file no-unused-vars
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";
import { PsOutput } from "../../process/ps.ts";
import { IPkgInfo, IPkgMgr } from "../pkgmgr.ts";

registerExe("nuget", {
    windows: [
        "%ChocolateyInstall%\\bin\\nuget.exe",
    ]
});

export function nuget(args?: string[], options?: IExecOptions) {
    return exec("nuget", args, options);
}

nuget.cli = nuget;
nuget.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("nuget", args, options);
}

export class NugetManager implements IPkgMgr {
    readonly name: string = "nuget";

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