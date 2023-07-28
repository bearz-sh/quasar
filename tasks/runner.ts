import { ITask } from "./interfaces.ts";
import { Tasks } from "./task_collection.ts";
import { parse } from "https://deno.land/std@0.195.0/flags/mod.ts";
import { HostWriter } from "../fmt/host_writer.ts";
import { green, magenta, red, yellow } from "../deps.ts";

export const hostWriter = new HostWriter();

interface IRunArgs {
    [x: string]: unknown;
    "skip-deps": unknown;
    timeout: unknown;
    skipDeps: unknown;
    _: (string | number)[];
}

function listTasks() {
    const tasks = Tasks;
    hostWriter.writeLine(`Quasar Task Runner version 0.1.0`);
    hostWriter.writeLine();

    hostWriter.writeLine(`TASKS:`);
    const maxTask = tasks
        .toArray()
        .map((t) => t.id.length)
        .reduce((a, b) => Math.max(a, b), 0);
    for (const task of tasks) {
        hostWriter.writeLine(`  ${task.id.padEnd(maxTask)}  ${task.description ?? ""}`);
    }
}

function writeHelp() {
    hostWriter.writeLine(`Quasar Task Runner version 0.1.0`);
    hostWriter.writeLine();
    hostWriter.writeLine(`USAGE:`);
    hostWriter.writeLine(`  qtr [...TASK] [OPTIONS]`);
    hostWriter.writeLine();
    hostWriter.writeLine(`OPTIONS:`);
    hostWriter.writeLine(`  -h, --help`);
    hostWriter.writeLine(`  -s, --skip-deps`);
    hostWriter.writeLine(`  -t, --timeout`);
    hostWriter.writeLine();
    hostWriter.writeLine(`TASKS:`);
    const tasks = Tasks;
    const maxTask = tasks
        .toArray()
        .map((t) => t.id.length)
        .reduce((a, b) => Math.max(a, b), 0);
    for (const task of tasks) {
        hostWriter.writeLine(`  ${task.id.padEnd(maxTask)}  ${task.description ?? ""}`);
    }
}

export interface ITasksResult {
    status: "ok" | "failed" | "timedout" | "skipped";
    task: ITask;
}

async function runTask(
    task: ITask,
    signal: AbortSignal,
    state: Map<string, unknown>,
    timeoutValue: number,
    results: ITasksResult[],
) {
    let failed = false;
    const onAbort = () => {
        hostWriter.warn(`${task.name} timed out after ${timeoutValue} seconds`);
        failed = true;
        results.push({ status: "timedout", task });
    };
    signal.addEventListener("abort", onAbort, { once: true });

    try {
        await task.run(state, signal);
        results.push({ status: "ok", task });
    } catch (e) {
        failed = true;
        results.push({ status: "failed", task });
        if (e instanceof Error) {
            hostWriter.error(e, `${task.name} failed: ${e.message}`);
        } else {
            hostWriter.error(`${task.name} failed: ${e}`);
        }

        signal.removeEventListener("abort", onAbort);
    }

    return failed;
}

async function runTasks(tasks: ITask[], args: IRunArgs) {
    const state = new Map<string, unknown>();
    const mainController = new AbortController();
    const mainSignal = mainController.signal;
    const timeoutValue = Number(args.timeout);
    const timeout = isNaN(timeoutValue) ? 3 * 60 : timeoutValue;
    const timeoutId = setTimeout(() => {
        mainController.abort();
    }, timeout * 1000);

    let failed = false;
    const results: ITasksResult[] = [];
    for (const task of tasks) {
        const force = task.force ?? false;

        if (task.skip) {
            if (typeof task.skip === "function") {
                const skip = await task.skip();
                if (skip) {
                    hostWriter.startGroup(`${task.name} (skipped)`);
                    hostWriter.endGroup();
                    results.push({ status: "skipped", task });
                    continue;
                }
            }
            hostWriter.startGroup(`${task.name} (skipped)`);
            results.push({ status: "skipped", task });
            hostWriter.endGroup();
            continue;
        }

        if (failed && !force) {
            hostWriter.startGroup(`${task.name} (skipped)`);
            hostWriter.endGroup();
            results.push({ status: "skipped", task });
            continue;
        }

        const to = task.timeout;
        hostWriter.startGroup(task.name);
        if (to && to > 0) {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutValue = Number(task.timeout);
            const handle = setTimeout(() => {
                controller.abort();
            }, timeoutValue * 1000);

            const r = await runTask(task, signal, state, timeoutValue, results);
            if (r) failed = true;
            hostWriter.writeLine();
            clearTimeout(handle);
        } else {
            const r = await runTask(task, mainSignal, state, timeout, results);
            if (r) failed = true;
        }
        hostWriter.endGroup();
    }

    clearTimeout(timeoutId);
    hostWriter.writeLine();
    hostWriter.writeLine(`SUMMARY:`);
    const max = results.map((r) => r.task.name.length).reduce((a, b) => Math.max(a, b), 0);

    for (const result of results) {
        switch (result.status) {
            case "ok":
                {
                    if (hostWriter.supportsColor.stdout.level) {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  ${green("completed")}`);
                    } else {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  completed`);
                    }
                }
                break;
            case "failed":
                {
                    if (hostWriter.supportsColor.stdout.level) {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  ${red("failed")}`);
                    } else {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  failed`);
                    }
                }

                console.log();
                break;
            case "skipped":
                {
                    if (hostWriter.supportsColor.stdout.level) {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  ${yellow("skipped")}`);
                    } else {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  skipped`);
                    }
                }
                break;
            case "timedout":
                {
                    if (hostWriter.supportsColor.stdout.level) {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  ${magenta("timed out")}`);
                    } else {
                        hostWriter.writeLine(`  ${result.task.name.padEnd(max)}  timed out`);
                    }
                }
                break;
        }
    }

    return results.some((r) => r.status === "failed" || r.status === "timedout") ? 1 : 0;
}

function detectCycles(tasks: ITask[]) {
    const stack = new Set<string>();
    const resolve = (task: ITask) => {
        if (stack.has(task.id)) {
            hostWriter.error(`Cycle detected in task dependencies: ${[...stack.values(), task.id].join(" -> ")}`);
            Deno.exit(1);
        }

        stack.add(task.id);
        for (const dep of task.deps) {
            const depTask = Tasks.get(dep);
            if (!depTask) {
                hostWriter.error(`Dependency task '${dep}' not found for task '${task.name}'`);
                Deno.exit(1);
            }

            resolve(depTask);
        }

        stack.delete(task.id);
    };

    for (const task of tasks) {
        resolve(task);
    }
}

function flattenTasks(tasks: ITask[]) {
    const result: ITask[] = [];

    // detect cycles

    for (const task of tasks) {
        if (!task) {
            continue;
        }

        for (const dep of task.deps) {
            const depTask = Tasks.get(dep);
            if (!depTask) {
                hostWriter.error(`Dependency task '${dep}' not found for task '${task.name}'`);
                Deno.exit(1);
            }

            result.push(...flattenTasks([depTask]));
            if (!result.includes(depTask)) {
                result.push(depTask);
            }
        }

        if (!result.includes(task)) {
            result.push(task);
        }
    }

    return result;
}

export async function runTaskRunner() {
    const args = Deno.args;
    const cmds: string[] = [];
    const optArgs: string[] = [];
    let collectOpts = false;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith("-")) {
            collectOpts = true;
        }

        if (collectOpts) {
            optArgs.push(arg);
            continue;
        }

        cmds.push(arg);
    }

    const flags: IRunArgs = parse(optArgs, {
        boolean: ["skip-deps", "skipDeps"],
        alias: {
            h: "help",
            s: "skip-deps",
            t: "timeout",
        },
        default: {
            skipDeps: false,
            timeout: 3 * 60,
            help: false,
        },
    });

    if (cmds.length === 0) {
        cmds.push("default");
    }

    if (flags.help === true) {
        writeHelp();
        Deno.exit(0);
    }

    switch (cmds[0]) {
        case "tasks":
            {
                if (cmds.length > 1) {
                    switch (cmds[1]) {
                        case "list":
                            listTasks();
                            Deno.exit(0);
                            break;
                        default:
                            hostWriter.error(`Unknown tasks sub command '${cmds[1]}'`);
                            Deno.exit(1);
                    }
                } else {
                    listTasks();
                    Deno.exit(0);
                }
            }

            break;

        default:
            {
                const topLevelTasks: ITask[] = [];
                for (const cmd of cmds) {
                    const task = Tasks.get(cmd);
                    if (!task) {
                        if (cmd === "default") {
                            hostWriter.error("No default task found");
                            writeHelp();
                            Deno.exit(1);
                        }

                        console.error(`Task '${cmd}' not found`);
                        writeHelp();
                        Deno.exit(1);
                    }

                    topLevelTasks.push(task);
                }

                if (topLevelTasks.length === 1 && topLevelTasks[0].deps.length === 0) {
                    const result = await runTasks(topLevelTasks, flags);
                    Deno.exit(result);
                }

                if (flags["skip-deps"] === true) {
                    const result = await runTasks(topLevelTasks, flags);
                    Deno.exit(result);
                }

                detectCycles(topLevelTasks);
                const tasks = flattenTasks(topLevelTasks);
                const result = await runTasks(tasks, flags);
                Deno.exit(result);
            }
            break;
    }
}
