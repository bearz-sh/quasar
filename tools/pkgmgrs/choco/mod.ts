import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe,
    PsOutput,
    IPkgInfo,
    IPkgMgr,
    upm,
} from "../../mod.ts";

registerExe("choco", {
    windows: [
        "%ChocolateyInstall%\\bin\\choco.exe",
        "%ProgramData%\\chocolatey\\bin\\choco.exe",
    ]
});

export function choco(args?: string[], options?: IExecOptions) {
    return exec("choco", args, options);
}

choco.cli = choco;
choco.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("choco", args, options);
}


export class ChocoManager implements IPkgMgr {
    #version: string | undefined;
    #isV2: boolean | undefined;
    
    readonly name: string = "choco";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        const splat = ["install", name, "-y"];
        if (version) {
            splat.push("--version", version);
        }

        if (args) {
            splat.push(...args);
        }

        return choco(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    uninstall(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["uninstall", name, "-y"];

        if (args) {
            splat.push(...args);
        }

        return choco(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["upgrade", name, "-y"];

        if (args) {
            splat.push(...args);
        }
        return choco(splat, { stdout: "inherit", stderr: "inherit" });
    }
 
    async list(query?: string, args?: string[]): Promise<IPkgInfo[]> {
        const splat = ["list"];

        if (query?.length)
            splat.push(query);

        splat.push("-r");

        if (!this.#version) {
            const out = await choco(["--version"], { stdout: "piped", stderr: "inherit" });
            this.#version = out.stdoutAsLines[0];
            this.#isV2 = !(this.#version.startsWith("0.") || this.#version.startsWith("1."));
        }

        if (args) {
            splat.push(...args);
        }

        // before v2 list performance a remote search unless -l is specified
        // and creates a warning, which we want to avoid in the output.
        if (!this.#isV2 && !args?.includes("-l")) {
            splat.push("-l");
        }
        
        const out = await choco(splat, { stdout: "piped", stderr: "inherit" });
        const results: IPkgInfo[] = [];
        for (let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];
            const parts = line.split("|");
            if (parts.length < 2) 
                continue;
            const name = parts[0].trim();
            const version = parts[1].trim();
            results.push({ name, version });
        }

        return results;
    }

    async search(query?: string,args?: string[]): Promise<IPkgInfo[]> {
        const splat = ["search"];

        if (query?.length)
            splat.push(query);

        splat.push("-r");

        if (!this.#version) {
            const out = await choco(["--version"], { stdout: "piped", stderr: "inherit" });
            this.#version = out.stdoutAsLines[0];
            this.#isV2 = !(this.#version.startsWith("0.") || this.#version.startsWith("1."));
        }

        if (args) {
            splat.push(...args);
        }

        const out = await choco(splat, { stdout: "piped", stderr: "inherit" });
        const results: IPkgInfo[] = [];
        for (let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];
            const parts = line.split("|");
            const name = parts[0].trim();
            const version = parts[1].trim();
            results.push({ name, version });
        }

        return results;
    }
}

upm.register("choco", new ChocoManager());