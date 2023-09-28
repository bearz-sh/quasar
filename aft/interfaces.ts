import { IHostWriter } from "../fmt/host_writer.ts";
import { IAftPackage, IAftSpec } from "./package/interfaces.ts";

export interface IAftDefaultNetwork {
    cidr: [number, number, number, number];
    name: string;
}

export interface IAftConfig extends Record<string, unknown> {
    defaults: {
        dns: {
            domain: string;
            subdomain?: string
        }
        tz: string;
        puid: number;
        guid: number;
        networks: Record<string, IAftDefaultNetwork>;
    }
    paths: {
        data: string;
        config: string;
    }
    mkcert: {
        domains: string[];
    };
    network: {
        name: string;
        subnet: string;
        gateway: string;
    }
    sops: {
        enabled: boolean;
        recipient?: string;
    }
}


export interface ISecretStore {
    get(path: string): Promise<string | undefined>;
    set(path: string, value: string): Promise<void>;
    remove(name: string): Promise<void>;
    list(): Promise<string[]>;
}

export interface ISecretsSection {
    name: string;
    path: string;
    default?: string
    length?: number;
    create?: boolean;
    digits?: boolean;
    symbols?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
}

export interface ISecretsImportSection extends Record<string, string | undefined> {
    path: string;
    password: string;
    url?: string;
    notes?: string;
    username?: string;
}

export interface IExecutionContext {
    secretStore: ISecretStore;
    config: IAftConfig;
    host: IHostWriter
}

export interface IPackageExecutionContext extends IExecutionContext {
    package: IAftPackage
}

