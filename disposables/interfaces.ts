export const disposableSymbol = Symbol("dispose");
export const asyncDisposableSymbol = Symbol("asyncDispose");

export interface IDisposable {
    [disposableSymbol](): void;
}

export interface IAsyncDisposable {
    [asyncDisposableSymbol](): Promise<void>;
}
