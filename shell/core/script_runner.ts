import { IExecOptions, IExecSyncOptions, PsOutput } from "./mod.ts";

export interface IScriptRunner {
    runScript(script: string, options?: IExecOptions): Promise<PsOutput>;

    runScriptSync(script: string, options?: IExecSyncOptions): PsOutput;

    runFile(file: string, options?: IExecOptions): Promise<PsOutput>;

    runFileSync(file: string, options?: IExecSyncOptions): PsOutput;
}

class ScriptRunner {
    #map: Map<string, IScriptRunner>;

    constructor() {
        this.#map = new Map<string, IScriptRunner>();
    }

    register(shell: string, scriptRunner: IScriptRunner) {
        this.#map.set(shell, scriptRunner);
    }

    has(shell: string): boolean {
        return this.#map.has(shell);
    }

    get(shell: string): IScriptRunner | undefined {
        return this.#map.get(shell);
    }

    runScript(shell: string, script: string, options?: IExecOptions): Promise<PsOutput> {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runScript(script, options);
    }

    runScriptSync(shell: string, script: string, options?: IExecSyncOptions): PsOutput {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runScriptSync(script, options);
    }

    runFile(shell: string, file: string, options?: IExecOptions): Promise<PsOutput> {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runFile(file, options);
    }

    runFileSync(shell: string, file: string, options?: IExecSyncOptions): PsOutput {
        if (!this.#map.has(shell)) {
            throw new Error(`No script runner registered for ${shell}`);
        }

        return this.#map.get(shell)!.runFileSync(file, options);
    }
}

export const scriptRunner = new ScriptRunner();
