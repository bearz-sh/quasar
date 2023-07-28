import { IAsyncDisposable, IDisposable } from "../../disposables/interfaces.ts";

export type { IDisposable };

// deno-lint-ignore ban-types
export type Constructor = new () => Object;

export interface IServiceProvider extends IDisposable, IAsyncDisposable {
    get<T>(key: string): T | undefined;

    getRequired<T>(key: string): T;

    getAll<T>(key: string): T[];

    createScope(): IServiceProviderLifetime;

    has(key: string): boolean;
}

export interface IServiceFactory {
    (s: IServiceProvider): unknown;
}

export interface IServiceProviderLifetime extends IDisposable {
    serviceProvider: IServiceProvider;

    dispose(): void;
}

export interface IServiceProviderLifetimeFactory {
    create(): IServiceProviderLifetime;
}

export interface IServiceCollection {
    factory(key: string, factory: IServiceFactory): IServiceCollection;

    transient<T>(key: string, factory: IServiceFactory | Constructor): IServiceCollection;

    tryAddTransient<T>(key: string, factory: IServiceFactory | Constructor): IServiceCollection;

    tryAddScoped<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection;

    tryAddSingleton<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection;

    scoped<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection;

    singleton<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection;

    build(): IServiceProvider;
}
