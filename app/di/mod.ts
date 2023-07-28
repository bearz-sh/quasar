// deno-lint-ignore-file

import { asyncDisposableSymbol, disposableSymbol, IAsyncDisposable } from "../../disposables/interfaces.ts";
import {
    Constructor,
    IDisposable,
    IServiceCollection,
    IServiceFactory,
    IServiceProvider,
    IServiceProviderLifetime,
    IServiceProviderLifetimeFactory,
} from "./interfaces.ts";

class Scope extends Map<string, unknown> {
    getDisposables(): IDisposable[] {
        const disposables = new Array<IDisposable>();
        for (const value of this.values()) {
            // deno-lint-ignore no-explicit-any
            if ((value as any).dispose) {
                disposables.push(value as IDisposable);
            }
        }

        return disposables;
    }

    getAsyncDisposables(): IAsyncDisposable[] {
        const disposables = new Array<IAsyncDisposable>();
        for (const value of this.values()) {
            // deno-lint-ignore no-explicit-any
            if ((value as any).asyncDispose) {
                disposables.push(value as IAsyncDisposable);
            }
        }

        return disposables;
    }
}

function isClass(func: unknown): boolean {
    return typeof func === "function" &&
        /^class\s/.test(Function.prototype.toString.call(func));
}

class ServiceProviderLifetime implements IServiceProviderLifetime {
    serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this.serviceProvider = new ServiceProvider();
        const factory = this.serviceProvider.getFactories();
        for (const [key, factories] of serviceProvider.getFactories()) {
            if (factory.has(key)) {
                continue;
            }

            factory.set(key, factories);
        }
    }

    [disposableSymbol]() {
        this.dispose();
    }

    dispose(): void {
        this.serviceProvider.dispose();
    }
}

class ServiceProviderLifetimeFactory implements IServiceProviderLifetimeFactory {
    #parent: ServiceProvider;

    constructor(parent: ServiceProvider) {
        this.#parent = parent;
    }

    create(): IServiceProviderLifetime {
        return new ServiceProviderLifetime(this.#parent);
    }
}

const globalScope = new Scope();

class ServiceProvider implements IServiceProvider, IServiceCollection {
    #factories = new Map<string, IServiceFactory[]>();
    #scope: Scope;

    constructor() {
        this.#scope = new Scope();
        this.#factories = new Map<string, IServiceFactory[]>();
        this.#factories.set("_serviceProvider", [() => this]);
        this.#factories.set("_scope", [() => this.#scope]);
        this.#factories.set("_serviceProviderLifetimeFactory", [() => new ServiceProviderLifetimeFactory(this)]);
    }

    [disposableSymbol]() {
        this.dispose();
    }

    async [asyncDisposableSymbol]() {
        await this.asyncDispose();
    }

    has(key: string): boolean {
        return this.#factories.has(key);
    }

    getFactories(): Map<string, IServiceFactory[]> {
        return this.#factories;
    }

    createScope(): IServiceProviderLifetime {
        const factories = this.#factories.get("_serviceProviderLifetimeFactory");
        if (factories) {
            const factory = factories[factories.length - 1];
            if (factory) {
                const lifeTimeFactory = factory(this) as IServiceProviderLifetimeFactory;
                return lifeTimeFactory.create();
            }
        }

        return new ServiceProviderLifetime(this);
    }

    get<T>(key: string): T | undefined {
        const factories = this.#factories.get(key);
        if (factories) {
            const factory = factories[factories.length - 1];
            if (factory) {
                return factory(this) as T;
            }

            return undefined;
        }

        return undefined;
    }

    getRequired<T>(key: string): T {
        const value = this.get<T>(key);
        if (value) {
            return value;
        }

        throw new Error(`No service for type '${key}' has been registered.`);
    }

    getAll<T>(key: string): T[] {
        const factories = this.#factories.get(key);
        if (factories) {
            const services = new Array<T>();
            for (const factory of factories) {
                services.push(factory(this) as T);
            }

            return services;
        }

        return [];
    }

    factory(key: string, factory: IServiceFactory): IServiceCollection {
        const factories = this.#factories.get(key);
        if (factories) {
            factories.push(factory);
        } else {
            this.#factories.set(key, [factory]);
        }

        return this;
    }

    tryAddTransient<T>(key: string, factory: IServiceFactory | Constructor): IServiceCollection {
        if (this.#factories.has(key)) {
            return this;
        }

        return this.transient(key, factory);
    }

    transient<T>(key: string, factory: IServiceFactory | Constructor): IServiceCollection {
        if (isClass(factory)) {
            const ctor = factory as Constructor;
            this.factory(key, (_) => new ctor());
            return this;
        }

        return this.factory(key, factory as IServiceFactory);
    }

    scoped<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection {
        if (typeof instance === "function") {
            if (isClass(instance)) {
                const ctor = instance as Constructor;
                this.factory(key, (s) => {
                    const scope = s.getRequired<Scope>("_scope");
                    if (scope.has(key)) {
                        return scope.get(key) as T;
                    }

                    const value = new ctor();
                    scope.set(key, value);
                    return value as T;
                });
                return this;
            }

            const factory = instance as IServiceFactory;
            this.factory(key, (s) => {
                const scope = s.getRequired<Scope>("_scope");

                if (scope.has(key)) {
                    return scope.get(key) as T;
                }

                const value = factory(s);
                scope.set(key, value);
                return value as T;
            });
        }

        this.factory(key, (s) => {
            const scope = s.getRequired<Scope>("_scope");

            if (scope.has(key)) {
                return scope.get(key) as T;
            }

            scope.set(key, instance);
            return instance as T;
        });

        return this;
    }

    tryAddScoped<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection {
        if (this.#factories.has(key)) {
            return this;
        }

        return this.scoped(key, instance);
    }

    tryAddSingleton<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection {
        if (this.#factories.has(key)) {
            return this;
        }

        return this.singleton(key, instance);
    }

    singleton<T>(key: string, instance: T | IServiceFactory | Constructor): IServiceCollection {
        if (typeof instance === "function") {
            if (isClass(instance)) {
                const factory = instance as Constructor;
                this.factory(key, (_) => {
                    if (globalScope.has(key)) {
                        return globalScope.get(key) as T;
                    }

                    const value = new factory();
                    globalScope.set(key, value);
                    return value as T;
                });
                return this;
            }

            const factory = instance as IServiceFactory;
            this.factory(key, (s) => {
                if (globalScope.has(key)) {
                    return globalScope.get(key) as T;
                }

                const value = factory(s);
                globalScope.set(key, value);
                return value as T;
            });
        }

        this.factory(key, (_s) => {
            if (globalScope.has(key)) {
                return globalScope.get(key) as T;
            }

            globalScope.set(key, instance);
            return instance as T;
        });

        return this;
    }

    build(): IServiceProvider {
        return this;
    }

    dispose(): void {
        this.#scope.getDisposables().forEach((d) => d[disposableSymbol]());
    }

    async asyncDispose(): Promise<void> {
        const disposables = this.#scope.getDisposables();

        for (const disposable of this.#scope.getAsyncDisposables()) {
            if (disposables.includes(disposable as any)) {
                disposables.splice(disposables.indexOf(disposable as any), 1);
            }

            await disposable[asyncDisposableSymbol]();
        }

        disposables.forEach((d) => d[disposableSymbol]());
    }
}

export function createServiceCollection() {
    return new ServiceProvider();
}
