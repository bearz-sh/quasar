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

export const pkgmgrs = new Map<string, IPkgMgr>();