import { IHostWriter } from "../../fmt/host_writer.ts";
import { hostWriter } from "../../ci/mod.ts";
import { IAftConfig, IExecutionContext, ISecretStore, IPackageExecutionContext } from "../interfaces.ts";
import { load } from "../config/mod.ts";
import { getOrCreateDefaultStore } from "../secrets/store.ts";
import { IAftPackage } from "../package/interfaces.ts";
import { AftPackage } from "../package/mod.ts";

export class ExecutionContext implements IExecutionContext {
    readonly secretStore: ISecretStore;
    readonly config: IAftConfig;
    readonly host: IHostWriter;


    constructor(secureStore: ISecretStore, config: IAftConfig, host: IHostWriter) {
        this.secretStore = secureStore;
        this.config = config;
        this.host = host;
    }

    static async create(secretStore?: ISecretStore, config?: IAftConfig, host?: IHostWriter): Promise<IExecutionContext> {
        config ??= await load();
        host ??= hostWriter;
        secretStore ??= await getOrCreateDefaultStore()

        return new ExecutionContext(secretStore, config, host);
    }
}

export class PackageExecutionContext implements IPackageExecutionContext {
    package: IAftPackage;
    secretStore: ISecretStore;
    config: IAftConfig;
    host: IHostWriter;

    constructor(executionContext: IExecutionContext, pkg: IAftPackage) {
        this.package = pkg;;
        this.secretStore = executionContext.secretStore;
        this.config = executionContext.config;
        this.host = executionContext.host;
    }

    static async create(executionContext: IExecutionContext, pkgFile: string): Promise<IPackageExecutionContext> {
        const pkg = await AftPackage.load(pkgFile);
        return new PackageExecutionContext(executionContext, pkg);
    }
}