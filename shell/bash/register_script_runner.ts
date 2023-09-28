import { runFile, runFileSync, runScript, runScriptSync } from "./cli.ts";
import { scriptRunner } from "../core/script_runner.ts";

scriptRunner.register("bash", {
    runScript,
    runScriptSync,
    runFile,
    runFileSync,
});
