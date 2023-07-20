import { PsOutput } from "../process/ps.ts";

export interface IPkgInfo {
    name: string;

    version: string;
}

export interface IPkgMgr {

    readonly name: string;

    install(name: string, version?: string, args?: string[]): Promise<PsOutput>
    
    uninstall(name: string, args?: string[]): Promise<PsOutput>
    
    upgrade(name: string, args?: string[]): Promise<PsOutput>;

    list(query: string, args?: string[]): Promise<IPkgInfo[]>;

    search(query: string, args?: string[]): Promise<IPkgInfo[]>;
}