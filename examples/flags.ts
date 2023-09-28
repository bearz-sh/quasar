import { parseFlags } from "../deps.ts";

console.log(parseFlags(["task/one", "task2", "--task-file", "tasks.ts", "--ef", ".env", "-h", "--skip-deps"], {
    boolean: ["skip-deps"],
    string: ["task-file", "env-file", "env"],
    collect: ["env-file", "env"],
    alias: {
        h: "help",
        s: "skip-deps",
        t: "timeout",
        e: "env",
        ef: "env-file",
        tf: "task-file",
        l: "list",
        wd: "working-directory",
    },
    default: {
        "working-directory": Deno.cwd(),
        list: false,
        "skip-deps": false,
        timeout: 3 * 60,
        help: false,
        "task-file": undefined,
        "env-file": [],
        env: [],
    },
}));
