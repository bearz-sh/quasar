import { asyncDisposableSymbol, disposableSymbol, IAsyncDisposable, IDisposable } from "./interfaces.ts";

export abstract class Disposable implements IDisposable {
    #isDisposed: boolean;

    constructor() {
        this.#isDisposed = false;
    }

    public get isDisposed(): boolean {
        return this.#isDisposed;
    }

    [disposableSymbol]() {
        if (this.#isDisposed) {
            return;
        }

        this.#isDisposed = true;
        this.disposeCore();
    }

    protected abstract disposeCore(): void;
}

export class CompositeDisposable extends Disposable {
    #disposables: IDisposable[];

    constructor(...disposables: IDisposable[]) {
        super();
        this.#disposables = disposables;
    }

    protected disposeCore(): void {
        for (const disposable of this.#disposables) {
            disposable[disposableSymbol]();
        }
    }
}

export class ObjectDisposedError extends Error {
    constructor(objectName: string) {
        super(`Object ${objectName} has been disposed.`);
    }
}

export function useSync<T extends IDisposable>(disposable: T, action: (disposable: T) => void): void;
export function useSync<T extends IDisposable, U extends IDisposable>(
    disposable: T,
    disposable2: U,
    action: (disposable: T, disposable2: U) => void,
): void;
export function useSync<T extends IDisposable, U extends IDisposable, V extends IDisposable>(
    disposable: T,
    disposable2: U,
    disposable3: V,
    action: (disposable: T, disposable2: U, disposable3: V) => void,
): void;
export function useSync() {
    switch (arguments.length) {
        case 2:
            {
                const disposable = arguments[0] as IDisposable;
                const action = arguments[1] as (disposable: IDisposable) => void;
                try {
                    action(disposable);
                } finally {
                    disposable[disposableSymbol]();
                }
            }
            break;

        case 3:
            {
                const disposable = arguments[0] as IDisposable;
                const disposable2 = arguments[1] as IDisposable;
                const action = arguments[2] as (disposable: IDisposable, disposable2: IDisposable) => void;
                try {
                    action(disposable, disposable2);
                } finally {
                    disposable[disposableSymbol]();
                    disposable2[disposableSymbol]();
                }
            }
            break;

        case 4:
            {
                const disposable = arguments[0] as IDisposable;
                const disposable2 = arguments[1] as IDisposable;
                const disposable3 = arguments[2] as IDisposable;
                const action = arguments[3] as (
                    disposable: IDisposable,
                    disposable2: IDisposable,
                    disposable3: IDisposable,
                ) => void;
                try {
                    action(disposable, disposable2, disposable3);
                } finally {
                    disposable[disposableSymbol]();
                    disposable2[disposableSymbol]();
                    disposable3[disposableSymbol]();
                }
            }

            break;
        default:
            throw new Error("Invalid number of arguments.");
    }
}

export async function use<T extends IAsyncDisposable>(disposable: T, action: (disposable: T) => void): Promise<void>;
export function use<T extends IAsyncDisposable, U extends IAsyncDisposable>(
    disposable: T,
    disposable2: U,
    action: (disposable: T, disposable2: U) => void,
): Promise<void>;
export function use<T extends IAsyncDisposable, U extends IAsyncDisposable, V extends IAsyncDisposable>(
    disposable: T,
    disposable2: U,
    disposable3: V,
    action: (disposable: T, disposable2: U, disposable3: V) => void,
): Promise<void>;
export async function use(): Promise<void> {
    switch (arguments.length) {
        case 2:
            {
                const disposable = arguments[0] as IAsyncDisposable;
                const action = arguments[1] as (disposable: IAsyncDisposable) => void;
                try {
                    action(disposable);
                } finally {
                    await disposable[asyncDisposableSymbol]();
                }
            }
            break;

        case 3:
            {
                const disposable = arguments[0] as IAsyncDisposable;
                const disposable2 = arguments[1] as IAsyncDisposable;
                const action = arguments[2] as (disposable: IAsyncDisposable, disposable2: IAsyncDisposable) => void;
                try {
                    action(disposable, disposable2);
                } finally {
                    await disposable[asyncDisposableSymbol]();
                    await disposable2[asyncDisposableSymbol]();
                }
            }
            break;

        case 4:
            {
                const disposable = arguments[0] as IAsyncDisposable;
                const disposable2 = arguments[1] as IAsyncDisposable;
                const disposable3 = arguments[2] as IAsyncDisposable;
                const action = arguments[3] as (
                    disposable: IAsyncDisposable,
                    disposable2: IAsyncDisposable,
                    disposable3: IAsyncDisposable,
                ) => void;
                try {
                    action(disposable, disposable2, disposable3);
                } finally {
                    await disposable[asyncDisposableSymbol]();
                    await disposable2[asyncDisposableSymbol]();
                    await disposable3[asyncDisposableSymbol]();
                }
            }

            break;
        default:
            throw new Error("Invalid number of arguments.");
    }
}
