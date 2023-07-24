import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync,
    generateScriptFile, 
    generateScriptFileSync, 
    registerExe,
    IPkgInfo,
    IPkgMgr,
    scriptRunner,
    upm,
    PsOutput,
    rm,
    rmSync,
    exists,
    existsSync
} from "../../mod.ts";

registerExe("pwsh", {
    windows: [
        "%ProgramFiles%/PowerShell/7/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/7/pwsh.exe",
        "%ProgramFiles%/PowerShell/6/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/6/pwsh.exe",
    ]
});


export function pwsh(args?: string[], options?: IExecOptions) {
    return exec("pwsh", args, options);
}

pwsh.cli = pwsh;
pwsh.sync = function(args?: string[], options?: IExecOptions) {
    return execSync("pwsh", args, options);
}

pwsh.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await pwsh.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

pwsh.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return pwsh.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
}

pwsh.script = async function(script: string, options?: IExecOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = await generateScriptFile(script, ".ps1");
    try  {
        return await pwsh.cli(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

pwsh.scriptSync = function(script: string, options?: IExecSyncOptions) {
    script = `
$ErrorActionPreference = 'Stop'
${script}
if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }
`;
    const scriptFile = generateScriptFileSync(script, ".ps1");
    try  {
        return pwsh.sync(['-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command', `. ${scriptFile}`], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}

export class PwshModuleManager implements IPkgMgr {
    readonly name: string = "pwsh";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        // use force for the case where the module is from an untrusted repository
        const splat = ["Install-Module", "-Name", `"${name}"`, "-Force"];

        if (version) {
            splat.push("-RequiredVersion", `"${version}"`);
        }

        if (args) {
            splat.push(...args);
        }

        return pwsh.script(`${splat.join(" ")}`);
    }

    uninstall(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["Uninstall-Module", "-Name", `"${name}"`];
        if (args) {
            splat.push(...args);
        }

        return pwsh.script(`${splat.join(" ")}`);
    }

    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        const splat = ["Update-Module", "-Name", `"${name}"`];
        if (args) {
            splat.push(...args);
        }

        return pwsh.script(`${splat.join(" ")}`);
    }


    list(query: string,args?: string[]|undefined): Promise<IPkgInfo[]> {
        const splat = ["Get-Module", "-ListAvailable", `-Name`, `"${query}"`];

        if (args) {
            splat.push(...args);
        }

        const options : IExecOptions = {
            stdout: "piped",
            stderr: "piped",
        };

        const cmd = `${splat.join(" ")} | ConvertTo-Json -Depth 5 -WA SilentlyContinue`;
        return pwsh.script(cmd, options).then((output) => {
            output.throwOrContinue();
            const json = output.stdoutAsString;
            if (json === null || json === undefined || json === "") {
                return [];
            }
            const results = JSON.parse(json);
            if (Array.isArray(results)) {
                return results.map(r => {
                    const v = r.Version;
                    let version = "";
                    if (v) {
                        version = v.Major + "." + v.Minor + "." + v.Build;
                        if (v.Revision > 0) {
                            version += "." + v.Revision;
                        }
                    }

                    const commands : string[] = [];
                    if (r.ExportedCommands) {
                        Object.keys(r.ExportedCommands).forEach(k => {
                            commands.push(k);
                        });
                    }

                    let deps : unknown[] = [];
                    if (r.RequiredModules)
                    {
                        // @ts-ignore - RequiredModules is not typed
                        deps = r.RequiredModules.map(m => { 
                            const v = m.Version;
                            let version = "";
                            if (v) {
                                version = v.Major + "." + v.Minor + "." + v.Build;
                                if (v.Revision > 0) {
                                    version += "." + v.Revision;
                                }
                            }
                            return {
                                "name": m.Name,
                                "version": version
                            }
                        });
                    }

                    return {
                        name: r.Name,
                        version: version,
                        description: r.Description,
                        tags: r.Tags,
                        projectUri: r.ProjectUri,
                        licenseUri: r.LicenseUri,
                        iconUri: r.IconUri,
                        path: r.Path,
                        guid: r.Guid,
                        commands: commands,
                        dependencies: deps
                    } as IPkgInfo;
                });
            }

            throw new Error("Unexpected output from Get-Module");
        });
    }
    search(query: string,args?: string[]|undefined): Promise<IPkgInfo[]> {
        const splat = ["Find-Module", `-Name`, `"${query}"`];

        if (args) {
            splat.push(...args);
        }

        const options : IExecOptions = {
            stdout: "piped",
            stderr: "piped",
        };

        const cmd = `${splat.join(" ")} | ConvertTo-Json -Depth 5 -WA SilentlyContinue`;
        return pwsh.script(cmd, options).then((output) => {
            output.throwOrContinue();
            const json = output.stdoutAsString;
            if (json === null || json === undefined || json === "") {
                return [];
            }

            const results = JSON.parse(json);
            if (Array.isArray(results)) {
                return results.map(r => {
                    let deps : unknown[] = [];
                    if (r.Dependencies) {
                        // @ts-ignore - Dependencies is not typed
                        deps = r.Dependencies.map(d => {
                            return {
                                "id": d.CanonicalId,
                                "name": d.Name,
                                "version": d.RequiredVersion,
                                "minimumVersion": d.MinimumVersion,
                            }
                        });
                    }
                    return {
                        name: r.Name,
                        version: r.Version,
                        description: r.Description,
                        tags: r.Tags,
                        projectUri: r.ProjectUri,
                        licenseUri: r.LicenseUri,
                        iconUri: r.IconUri,
                        guid: r.AdditionalMetadata?.GUID,
                        publishedDate: r.PublishedDate,
                        repository: r.Repository,
                        dependencies: deps
                    } as IPkgInfo;
                });
            }

            throw new Error("Unexpected output from Find-Module");
        });
    }
}

upm.register("pwsh", new PwshModuleManager());
scriptRunner.register("pwsh", {
    run: pwsh.script,
    runSync: pwsh.scriptSync,
    runFile: pwsh.scriptFile,
    runFileSync: pwsh.scriptFileSync,
})