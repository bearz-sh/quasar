import { IExecOptions } from "../process/exec.ts";
import { PsOutput } from "../process/ps.ts";

export interface IPkgInfo {
    name: string;

    version: string;
}

export interface IPkgMgr {

    readonly name: string;

    install(name: string, version?: string, args?: string[], options?: IExecOptions): Promise<PsOutput>
    
    uninstall(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput>
    
    upgrade(name: string, args?: string[], options?: IExecOptions): Promise<PsOutput>;

    list(query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]>;

    search(query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]>;
}

class UniveralPackageManager
{
    #map: Map<string, IPkgMgr>;

    /**
     * Create a new instance of the UniversalPackageManager.
     */
    constructor()
    {
        this.#map = new Map<string, IPkgMgr>();
    }

    /**
     * Register a package manager
     * @param name The name of the package manager
     * @param pkgMgr The package manager implementation
     */
    register(name: string, pkgMgr: IPkgMgr) {
        this.#map.set(name, pkgMgr);
    }

    /**
     * Determine if a package manager is registered.
     * @param name The name of the manager.
     * @returns true if the package manager is registered; otherwise, false.
     */
    has(name: string): boolean {
        return this.#map.has(name);
    }

    /**
     * Gets a package manager by name.
     * @param name The name of the package manager.
     * @returns The package manager.
     */
    get(name: string): IPkgMgr | undefined {
        return this.#map.get(name);
    }

    /**
     * Install a package using a universal package identifier. e.g.
     * `pm:pkg@version?option1=value&flag1&option2=value` where pm is the package manager, 
     * pkg is the package name, version is the version, and options are the options.
     * @param uri The univerisal package identifier.
     * @param options The options for the execution.
     * @returns returns the PsOutput from the execution of the package manager.
     */
    async uriInstall(uri: string, options?: IExecOptions): Promise<PsOutput>
    {
        if (uri.includes(':'))
        {
            const [mgr, pkgStr] = uri.split(':');
            if (pkgStr.includes('@'))
            {
                const [pkg, version] = pkgStr.split('@').map(x => x.trim());
                if (version.includes("?"))
                {
                    const [v, params] = version.split('?').map(x => x.trim());
                    const args : string[] = [];
                    for (const param of params.split('&'))
                    {
                        if (param.includes("="))
                        {
                            const [key, value] = param.split('=').map(x => x.trim());
                            if (value === undefined || value === null || value === "")
                            {
                                if (!key.startsWith("-"))
                                    args.push(`--${key}`);
                                continue;
                            }

                            if (value === "false")
                                continue;

                            if (value === "true")
                            {
                                if (!key.startsWith("-"))
                                    args.push(`--${key}`);
                                continue;
                            }
                            
                            if (!key.startsWith("-"))
                                args.push(`--${key}=${value}`);

                            continue;
                        }

                        if (!param.startsWith("-"))
                            args.push(`--${param}`);
                    }

                    return await this.install(mgr, pkg, v, args, options);
                }

                return await this.install(mgr, pkg, version, undefined, options);
            }

            if (pkgStr.includes("?"))
            {
                const [pkg, params] = pkgStr.split('?').map(x => x.trim());
                const args : string[] = [];
                for (const param of params.split('&'))
                {
                    if (param.includes("="))
                    {
                        const [key, value] = param.split('=').map(x => x.trim());
                        if (value === undefined || value === null || value === "")
                        {
                            if (!key.startsWith("-"))
                                args.push(`--${key}`);
                            continue;
                        }

                        if (value === "false")
                            continue;

                        if (value === "true")
                        {
                            if (!key.startsWith("-"))
                                args.push(`--${key}`);
                            continue;
                        }
                        
                        if (!key.startsWith("-"))
                            args.push(`--${key}=${value}`);

                        continue;
                    }

                    if (!param.startsWith("-"))
                        args.push(`--${param}`);
                }

                return await this.install(mgr, pkg, undefined, args, options);
            }


            return await this.install(mgr, pkgStr, undefined, undefined, options);
        }

        throw new Error(`Unknown package identifier ${uri}`);
    }

    /**
     * Installs a package.
     * @param mgr The name of the package manager e.g. apt, choco, npm, dotnet, brew, etc
     * @param packageName The name of the package to install.
     * @param version The version of the package.
     * @param args The additional arguments to pass to the package manager.
     * @param options The options for the execution.
     * @returns The PsOutput from the execution of the package manager.
     * @example
     * ```typescript
     * import { upm } from 'https://deno.land/x/quasar@MOD_VERSION/tools/mod.ts';
     * import from 'https://deno.land/x/quasar/tools/apt/mod.ts'; // register apt package manager
     * 
     * await upm.install('apt', 'curl', '7.68.0', ['--no-install-recommends', '--no-upgrade'], { cwd: '/tmp' });
     * ```
     */
    async install(mgr: string, packageName: string, version?: string, args?: string[], options?: IExecOptions): Promise<PsOutput>
    {
        const pkgMgr = this.get(mgr);
        if (!pkgMgr) {
            throw new Error(`Unknown package manager ${mgr}`);
        }

        return await pkgMgr.install(packageName, version, args, options);
    }

    /**
     * Uninstalls a package.
     * @param mgr The name of the package manager e.g. apt, choco, npm, dotnet, brew, etc
     * @param packageName The name of the package to uninstall.
     * @param version The version of the package.
     * @param args The additional arguments to pass to the package manager.
     * @param options The options for the execution.
     * @returns The PsOutput from the execution of the package manager.
     */
    async uninstall(mgr: string, packageName: string, args?: string[], options?: IExecOptions): Promise<PsOutput>
    {
        const pkgMgr = this.get(mgr);
        if (!pkgMgr) {
            throw new Error(`Unknown package manager ${mgr}`);
        }

        return await pkgMgr.uninstall(packageName, args, options);
    }

    /**
     * Upgrades a package.
     * 
     * @param mgr The name of the package manager e.g. apt, choco, npm, dotnet, brew, etc
     * @param packageName The name of the package to upgrade.
     * @param version The version of the package.
     * @param args The additional arguments to pass to the package manager.
     * @param options The options for the execution.
     * @returns The PsOutput from the execution of the package manager.
     */
    async upgrade(mgr: string, packageName: string, args?: string[], options?: IExecOptions): Promise<PsOutput>
    {
        const pkgMgr = this.get(mgr);
        if (!pkgMgr) {
            throw new Error(`Unknown package manager ${mgr}`);
        }

        return await pkgMgr.upgrade(packageName, args, options);
    }

    /**
     * Lists the local packages that are installed in a given context.
     * 
     * @param mgr The name of the package manager e.g. apt, choco, npm, dotnet, brew, etc
     * @param query The query to use to limit the list of packages.
     * @param args The additional arguments to pass to the package manager.
     * @param options The options for the execution.
     * @returns The list of packages.
     */
    async list(mgr: string, query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]>
    {
        const pkgMgr = this.get(mgr);
        if (!pkgMgr) {
            throw new Error(`Unknown package manager ${mgr}`);
        }

        return await pkgMgr.list(query, args, options);
    }

    /**
     * Remotely searches for available packages.
     * 
     * @param mgr The name of the package manager e.g. apt, choco, npm, dotnet, brew, etc
     * @param query The search query.
     * @param args The additional arguments to pass to the package manager.
     * @param options The options for the execution.
     * @returns The list of packages.
     */
    async search(mgr: string, query?: string, args?: string[], options?: IExecOptions): Promise<IPkgInfo[]>
    {
        const pkgMgr = this.get(mgr);
        if (!pkgMgr) {
            throw new Error(`Unknown package manager ${mgr}`);
        }

        return await pkgMgr.search(query, args, options);
    }
}

/**
 * Universal package manager
 */
export const upm = new UniveralPackageManager();