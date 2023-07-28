export interface IChangeToken
{
    /** 
     * Gets a value that indicates if a change has occurred.
     */
    readonly hasChanged: boolean

    /** 
     * Indicates if this token will pro-actively raise callbacks. If <c>false</c>, the token consumer must
     * poll @see hasChanged to detect changes.
     */ 
    readonly activeChangeCallbacks: boolean;

    /**
     * Registers for a callback that will be invoked when the entry has changed. @see hasChanged 
     * MUST be set before the callback is invoked.
     * @param callback the callback to invoke.
     * @param state the state to be passed into the callback.
     * @returns an object that is used to unregister the callback.
     */
    registerChangeCallback(callback: (value?: unknown) => void, state: unknown) : { dispose(): void };
}

export interface IConfig
{
    get(key: string) : string | undefined;

    set(key: string, value: string): void;

    getSection(key: string): IConfigSection;

    getChildren(): IConfigSection[];

    // getReloadToken() : IChangeToken;
}

export interface IConfigSection extends IConfig
{
    readonly key: string;

    readonly path: string;

    value: string | undefined;
}

export interface IConfigRoot extends IConfig 
{
    readonly providers: Iterable<IConfigProvider>;

    // reload(): void;
}

export interface IConfigProvider
{
    get(key: string): string | undefined;

    set(key: string, value: string): void;

    // getReloadToken(): IChangeToken;
    load(): void;

    getChildKeys(earlierKeys: string[], parentPath?: string): string[];
}

export interface IConfigBuilder 
{
    readonly properties: Map<string, unknown>;

    readonly sources: IConfigSource[];

    add(source: IConfigSource): IConfigBuilder;

    build(): IConfigRoot;
}

export interface IConfigSource
{
    build(builder: IConfigBuilder): IConfigProvider;
}