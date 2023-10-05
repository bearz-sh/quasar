import { assert, test } from "../testing/mod.ts";
import { isEnvEnabled, isRunEnabled } from "../testing/deno_permissions.ts";
import { capture, captureSync, exec, execSync } from "./ps.ts";
import { get } from "../os/env.ts";
import { HOME_VAR_NAME } from "../os/constants.ts";
import { IS_WINDOWS, ps } from "../mod.ts";

const hasRun = await isRunEnabled();
const hasEnv = await isEnvEnabled();

test.when(hasRun, "exec: success", async () => {
    const { code } = await exec("git", "--version");
    assert.equals(code, 0);
});

test.when(hasRun, "exec: failure", async () => {
    const { code } = await exec("git", "not-a-command");
    assert.equals(code, 1);
});

test.when(hasRun, "execSync: success", () => {
    const { code } = execSync("git", "--version");
    assert.equals(code, 0);
});

test.when(hasRun, "execSync: failure", () => {
    const { code } = execSync("git", "not-a-command");
    assert.equals(code, 1);
});

test.when(hasRun, "capture: success", async () => {
    const { code, stdoutText } = await capture("git", "--version");
    assert.equals(code, 0);
    assert.stringIncludes(stdoutText, "git version");
});

test.when(hasRun, "capture: failure", async () => {
    const { code, stderrText } = await capture("git", "not-a-command");
    assert.equals(code, 1);
    assert.stringIncludes(stderrText, "git: 'not-a-command' is not a git command. See 'git --help'.");
});

test.when(hasRun, "captureSync: success", () => {
    const { code, stdoutText } = captureSync("git", "--version");
    assert.equals(code, 0);
    assert.stringIncludes(stdoutText, "git version");
});

test.when(hasRun, "captureSync: failure", () => {
    const { code, stderrText } = captureSync("git", "not-a-command");
    assert.equals(code, 1);
    assert.stringIncludes(stderrText, "git: 'not-a-command' is not a git command. See 'git --help'.");
});

test.when(hasRun, "output: success with inherit pipe", async () => {
    const { code } = await exec("git", "--version", { stdout: "inherit", stderr: "inherit" });
    assert.equals(code, 0);
});

test.when(hasRun, "output: success with capture pipe", async () => {
    const { code, stdoutText } = await exec("git", "--version", { stdout: "piped", stderr: "piped" });
    assert.equals(code, 0);
    assert.stringIncludes(stdoutText, "git version");
});

test.when(hasRun && hasEnv, "output: failure with inherit & different cwd", async () => {
    const home = get(HOME_VAR_NAME);
    const { code, args } = await exec("git", "status -s", { 
        stdout: "inherit",
        stderr: "inherit",
        cwd: home,
    });
    console.log(args);
    assert.equals(code, 128);
});

test.when(hasRun && hasEnv, "output: failure with piped & different cwd", async () => {
    const home = get(HOME_VAR_NAME);
    const { code, stderrText } = await exec("git", ["status", "-s"], { 
        stdout: "piped",
        stderr: "piped",
        cwd: home,
    });
    assert.equals(code, 128);
    assert.stringIncludes(stderrText, "fatal: not a git repository (or any of the parent directories): .git");
});

test.when(hasRun, "outputSync: success with inherit pipe", () => {
    const { code } = execSync("git", ["--version"], {
        stdout: "inherit",
        stderr: "inherit",
    });
    assert.equals(code, 0);
});

test.when(hasRun, "outputSync: success with capture pipe", () => {
    const { code, stdoutText } = execSync("git", ["--version"], {
        stdout: "piped",
        stderr: "piped",
    });
    assert.equals(code, 0);
    assert.stringIncludes(stdoutText, "git version");
});

test.when(hasRun && !IS_WINDOWS, "ps: can pipe", async () => {
    const result = await 
        ps("echo", "my test")
        .pipe("grep", "test")
        .pipe("cat")
        .output();
    assert.equals(result.code, 0);
    console.log(result.stdoutText);
});

test.when(hasRun && !IS_WINDOWS, "exec: can pipe", async () => {
    const result = await exec("cat", [], { input: "my test", stdout: "piped" });
    assert.equals(result.code, 0);
    assert.equals(result.stdoutText, "my test");
});

test.when(hasRun && !IS_WINDOWS, "capture: splat", async () => {
    const result = await capture("echo", { text: "hello"}, { splat: { arguments: ["text"] } });
    assert.equals(result.code, 0);
    assert.equals(result.stdoutText, "hello\n");

});

test.when(hasRun && hasEnv, "outputSync: failure with inherit & different cwd", () => {
    const home = get(HOME_VAR_NAME);
    const { code } = execSync("git", ["status", "-s"], {
        stdout: "inherit",
        stderr: "inherit",
        cwd: home,
    });
    assert.equals(code, 128);
});

test.when(hasRun && hasEnv, "outputSync: failure with piped & different cwd", () => {
    const home = get(HOME_VAR_NAME);
    const { code, stderrText } = execSync("git", ["status", "-s"], {
        stdout: "piped",
        stderr: "piped",
        cwd: home,
    });
    assert.equals(code, 128);
    assert.stringIncludes(stderrText, "fatal: not a git repository (or any of the parent directories): .git");
});
