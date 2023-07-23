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

const findOptions = registerExe("apt", {});

export function apt(args?: string[], options?: IExecOptions) {
    return exec("apt", args, options);
}

apt.cli = apt;
apt.findOptions = findOptions;
apt.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("apt", args, options);
}

export interface AptPkgInfo extends IPkgInfo {
    repos: string[];
    desc: string;
    arch: string;
}

export class AptManager implements IPkgMgr {
    readonly name: string = "apt";

    install(name: string, version?: string, args?: string[]): Promise<PsOutput> {
        const pkg = version ? `${name}=${version}` : name;
        return apt(["install", pkg, "-y"], { stdout: "inherit", stderr: "inherit" });
    }
 
    uninstall(name: string, args?: string[]): Promise<PsOutput> {
        return apt(["remove", name, "-y"], { stdout: "inherit", stderr: "inherit" });
    }

    update(args?: string[]): Promise<PsOutput> {
        return apt(["update"], { stdout: "inherit", stderr: "inherit" });
    }
 
    upgrade(name: string, args?: string[]): Promise<PsOutput> {
        return apt(["upgrade", "-y"], { stdout: "inherit", stderr: "inherit" });
    }
 
    async list(query: string, args?: string[]): Promise<IPkgInfo[]> {
        
        const out = await apt(["list", "--installed", query, "-qq"], { stdout: "piped", stderr: "inherit" });
        let consumeDescription = false;
        let pkg: AptPkgInfo | undefined;
        const results: AptPkgInfo[] = [];

        // TODO: parse the output to lower string allocations
        for(let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];

            if (consumeDescription) {
                if(pkg) {
                    pkg.desc += line;
                    pkg = undefined;
                    consumeDescription = false;
                }

                continue;
            }
            
            if (!consumeDescription && line.includes("/")) {
                const parts = line.split(" ");
                const first = parts[0];
                const nameAndRepos = first.split("/");
                const name = nameAndRepos[0];
                const repos = nameAndRepos[1].split(",");
                const version = parts[1];
                const arch = parts[2];
                results.push({ name, version, arch, desc: "", repos });
                consumeDescription = true;
                break;
            }
        }

        return results;
    }

    async search(query: string,args?: string[]): Promise<IPkgInfo[]> {
        const out = await apt(["search", query, "-qq"], { stdout: "piped", stderr: "inherit" });

        let consumeDescription = false;
        let pkg: AptPkgInfo | undefined;
        const results: AptPkgInfo[] = [];
        for(let i = 0; i < out.stdoutAsLines.length; i++) {
            const line = out.stdoutAsLines[i];

            if (consumeDescription) {
                if(pkg) {
                    pkg.desc += line;
                    pkg = undefined;
                    consumeDescription = false;
                }

                continue;
            }

            if (!consumeDescription && line.includes("/")) {
                const parts = line.split(" ");
                const first = parts[0];
                const nameAndRepos = first.split("/");
                const name = nameAndRepos[0];
                const repos = nameAndRepos[1].split(",");
                const version = parts[1];
                const arch = parts[2];
                results.push({ name, version, arch, desc: "", repos });
                consumeDescription = true;
                break;
            }
        }

        return results;
    }
}

pkgmgrs.set("apt", new AptManager());