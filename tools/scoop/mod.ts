import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe,
    PlatformNotSupportedError,
    IS_WINDOWS,
    PsOutput,
    IPkgInfo,
    IPkgMgr,
    upm,
} from "../mod.ts";

registerExe("scoop", {
    windows: [
        "%USERPROFILE%\\scoop\\shims\\scoop.cmd",
        "%SCOOP%\\shims\\scoop.cmd",
    ]
});

export function scoop(args?: string[], options?: IExecOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError(`scoop is only supported on Windows.`);
    }

    return exec("scoop", args, options);
}

scoop.cli = scoop;
scoop.sync = function(args?: string[], options?: IExecSyncOptions) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError(`scoop is only supported on Windows.`);
    }

    return execSync("scoop", args, options);
}

export interface IScoopInfo extends IPkgInfo {
    source?: string;
    updated?: string;
    binaries?: string[];
}

export class ScoopManager implements IPkgMgr {
    #version: string | undefined;
    #isV2: boolean | undefined;
    
    readonly name: string = "scoop";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        const splat = ["install", version === undefined ? name : `${name}@${version}`];

        if (args) {
            splat.push(...args);
        }

        return scoop(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    uninstall(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["uninstall", name];

        if (args) {
            splat.push(...args);
        }

        return scoop(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["update", name, ];

        if (args) {
            splat.push(...args);
        }
        return scoop(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    async list(query?: string, args?: string[]): Promise<IPkgInfo[]> {
        const splat = ["list"];
        if (query?.length) {
            splat.push(query);
        }
        
        if (args?.length) {
            splat.push(...args);
        }
        
        const out = await scoop(splat, { stdout: "piped", stderr: "inherit" });

        const results: IScoopInfo[] = [];
        for (let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];
            const parts = line.split(" ").filter(x => x.length);
            const name = parts[0];
            const version = parts[1];
            
            let source = "";
            let updated = "";
            if (parts.length > 2)
                source = parts[2];

            if (parts.length > 3)
                updated = parts[3];

            results.push({ name, version, source, updated });
        }

        return results;
    }

    async search(query?: string,args?: string[]): Promise<IPkgInfo[]> {
        const splat = ["search"];
        if (query?.length) 
            splat.push(query);
    
        if (args?.length)
            splat.push(...args);

        const out = await scoop(splat, { stdout: "piped", stderr: "inherit" });
        const results: IScoopInfo[] = [];
        for (let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];
            const parts = line.split(" ").filter(x => x.length);
            const name = parts[0];
            const version = parts[1];
            let source = "";
            const binaries : string[] = [];
            if (parts.length > 2)
                source = parts[2];

            if (parts.length > 3)
                binaries.push(...parts.slice(3));


            results.push({ name, version, source, binaries });
        }

        return results;
    }
}

upm.register("scoop", new ScoopManager());