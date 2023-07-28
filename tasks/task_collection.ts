import { IS_WINDOWS } from "../os/constants.ts";
import { ITask, ITaskBuilder, ITaskCollection, TaskRun } from "./interfaces.ts";
import { scriptRunner } from "./script_runner.ts";

export class TaskCollection implements ITaskCollection {
    #tasks: string[] = [];
    #map: Map<string, ITask> = new Map();

    get size(): number {
        return this.#tasks.length;
    }

    at(index: number): ITask {
        const id = this.#tasks[index];
        return this.#map.get(id)!;
    }
    add(task: ITask): ITaskBuilder {
        if (this.#map.has(task.id)) {
            throw new Error(`Task '${task.id}' already exists`);
        }

        this.#tasks.push(task.id);
        this.#map.set(task.id, task);
        return {
            description(description: string) {
                task.description = description;
                return this as ITaskBuilder;
            },
            deps(...deps: string[]) {
                task.deps.push(...deps);
                return this as ITaskBuilder;
            },
            name(name: string) {
                task.name = name;
                return this as ITaskBuilder;
            },
            timeout(timeout: number) {
                task.timeout = timeout;
                return this as ITaskBuilder;
            },
            skip(skip: boolean | (() => Promise<boolean>)) {
                task.skip = skip;
                return this as ITaskBuilder;
            },
            set(attributes: Partial<Omit<ITask, "id" | "run">>): ITaskBuilder {
                for (const key in attributes) {
                    if (key === "id" || key === "run") {
                        continue;
                    }

                    // deno-lint-ignore no-explicit-any
                    (task as any)[key] = (attributes as any)[key];
                }

                return this as ITaskBuilder;
            },
        };
    }

    get(id: string): ITask | undefined {
        return this.#map.get(id);
    }
    has(id: string): boolean {
        return this.#map.has(id);
    }
    addRange(tasks: Iterable<ITask>): void {
        for (const task of tasks) {
            this.add(task);
        }
    }

    toArray(): ITask[] {
        return this.#tasks.map((id) => this.#map.get(id)!);
    }

    [Symbol.iterator](): Iterator<ITask> {
        return this.#map.values();
    }
}

export const Tasks = new TaskCollection();
export function task(id: string, action: TaskRun): ITaskBuilder;
export function task(id: string, deps: string[], action: TaskRun): ITaskBuilder;
export function task(id: string, name: string, action: TaskRun): ITaskBuilder;
export function task(id: string, name: string, deps: string[], action: TaskRun): ITaskBuilder;
export function task(): ITaskBuilder {
    const id = arguments[0] as string;
    let name = id;
    let deps: string[] = [];
    let action: TaskRun = arguments[1] as TaskRun;
    const description: string | undefined = undefined;
    const timeout: number | undefined = undefined;

    switch (arguments.length) {
        case 2:
            {
                if (!(typeof arguments[1] === "function")) {
                    throw new Error(`Excpected function for argument 'action'`);
                }

                action = arguments[1] as TaskRun;
            }
            break;

        case 3:
            {
                if (!(typeof arguments[2] === "function")) {
                    throw new Error(`Excpected string for argument 'name'`);
                }

                if (Array.isArray(arguments[1])) {
                    deps = arguments[1] as string[];
                } else {
                    name = arguments[1] as string;
                }

                action = arguments[2] as TaskRun;
            }
            break;

        case 4: {
            if (!(typeof arguments[1] === "string")) {
                throw new Error(`Excpected string for argument 'name'`);
            }

            if (!Array.isArray(arguments[2])) {
                throw new Error(`Excpected array for argument 'deps'`);
            }

            if (!(typeof arguments[3] === "function")) {
                throw new Error(`Excpected function for argument 'action'`);
            }

            name = arguments[1] as string;
            deps = arguments[2] as string[];
            action = arguments[3] as TaskRun;
        }
    }

    return Tasks.add({
        id,
        name,
        deps,
        description,
        timeout,
        run: action,
    });
}

export function shellTask(id: string, shell: string, script: string): ITaskBuilder;
export function shellTask(id: string, script: string): ITaskBuilder;
export function shellTask(): ITaskBuilder {
    const id = arguments[0] as string;
    let shell = IS_WINDOWS ? "powershell" : "bash";
    let script = "";
    switch (arguments.length) {
        case 2:
            script = arguments[1] as string;
            break;
        case 3:
            shell = arguments[1] as string;
            script = arguments[2] as string;
            break;

        default:
            throw new Error("Invalid arguments");
    }

    const wrap = async function (_state: Map<string, unknown>, signal: AbortSignal): Promise<void> {
        const out = await scriptRunner.run(shell, script, {
            signal: signal,
        });
        out.throwOrContinue();
    };

    const task: ITask = {
        id,
        name: id,
        description: undefined,
        deps: [],
        timeout: undefined,
        run: wrap,
    };

    return Tasks.add(task);
}
