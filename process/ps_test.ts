import { test, assert } from "../testing/mod.ts";
import { isRunEnabled, isEnvEnabled } from "../testing/deno_permissions.ts";
import { 
    run, 
    runSync, 
    capture, 
    captureSync,
    output,
    outputSync,
} from "./ps.ts";
import { get } from "../os/env.ts";
import { HOME_VAR_NAME } from "../os/constants.ts";

const hasRun = await isRunEnabled();
const hasEnv = await isEnvEnabled();

test.when(hasRun, "run: success", async () => {
    const { code } = await run("git", "--version");
    assert.equals(code, 0);
});

test.when(hasRun, "run: failure", async () => {
    const { code } = await run("git", "not-a-command");
    assert.equals(code, 1);
});

test.when(hasRun, "runSync: success", () => {
    const { code } = runSync("git", "--version");
    assert.equals(code, 0);
});

test.when(hasRun, "runSync: failure", () => {
    const { code } = runSync("git", "not-a-command");
    assert.equals(code, 1);
});

test.when(hasRun, "capture: success", async () => {
    const { code, stdoutAsString } = await capture("git", "--version");
    assert.equals(code, 0);
    assert.stringIncludes(stdoutAsString, "git version");
});

test.when(hasRun, "capture: failure", async () => {
    const { code, stderrAsString } = await capture("git", "not-a-command");
    assert.equals(code, 1);
    assert.stringIncludes(stderrAsString, "git: 'not-a-command' is not a git command. See 'git --help'.");
});

test.when(hasRun, "captureSync: success", () => {
    const { code, stdoutAsString } = captureSync("git", "--version");
    assert.equals(code, 0);
    assert.stringIncludes(stdoutAsString, "git version");
});

test.when(hasRun, "captureSync: failure", () => {
    const { code, stderrAsString } = captureSync("git", "not-a-command");
    assert.equals(code, 1);
    assert.stringIncludes(stderrAsString, "git: 'not-a-command' is not a git command. See 'git --help'.");
});

test.when(hasRun, "output: success with inherit pipe", async () => {
    const { code } = await output({
        file: "git",
        args: ["--version"],
        stdout: "inherit",
        stderr: "inherit",
    });
    assert.equals(code, 0);
});

test.when(hasRun, "output: success with capture pipe", async () => {
    const { code, stdoutAsString } = await output({
        file: "git",
        args: ["--version"],
        stdout: "piped",
        stderr: "piped",
    });
    assert.equals(code, 0);
    assert.stringIncludes(stdoutAsString, "git version");
});

test.when(hasRun && hasEnv, "output: failure with inherit & different cwd", async () => {
    const home = get(HOME_VAR_NAME)
    const { code } = await output({
        file: "git",
        args: ["status", "-s"],
        stdout: "inherit",
        stderr: "inherit",
        cwd: home,
    });
    assert.equals(code, 128);
});

test.when(hasRun && hasEnv, "output: failure with piped & different cwd", async () => {
    const home = get(HOME_VAR_NAME)
    const { code, stderrAsString } = await output({
        file: "git",
        args: ["status", "-s"],
        stdout: "piped",
        stderr: "piped",
        cwd: home,
    });
    assert.equals(code, 128);
    assert.stringIncludes(stderrAsString, "fatal: not a git repository (or any of the parent directories): .git");
});

test.when(hasRun, "outputSync: success with inherit pipe", () => {
    const { code } = outputSync({
        file: "git",
        args: ["--version"],
        stdout: "inherit",
        stderr: "inherit",
    });
    assert.equals(code, 0);
});

test.when(hasRun, "outputSync: success with capture pipe", () => {
    const { code, stdoutAsString } = outputSync({
        file: "git",
        args: ["--version"],
        stdout: "piped",
        stderr: "piped",
    });
    assert.equals(code, 0);
    assert.stringIncludes(stdoutAsString, "git version");
});

test.when(hasRun && hasEnv, "outputSync: failure with inherit & different cwd", () => {
    const home = get(HOME_VAR_NAME)
    const { code } = outputSync({
        file: "git",
        args: ["status", "-s"],
        stdout: "inherit",
        stderr: "inherit",
        cwd: home,
    });
    assert.equals(code, 128);
});

test.when(hasRun && hasEnv, "outputSync: failure with piped & different cwd", () => {
    const home = get(HOME_VAR_NAME)
    const { code, stderrAsString } = outputSync({
        file: "git",
        args: ["status", "-s"],
        stdout: "piped",
        stderr: "piped",
        cwd: home,
    });
    assert.equals(code, 128);
    assert.stringIncludes(stderrAsString, "fatal: not a git repository (or any of the parent directories): .git");
});