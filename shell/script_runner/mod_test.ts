import { scriptRunner } from "./mod.ts";
import { assert, test } from "../../testing/mod.ts";
import { IS_WINDOWS } from "../../mod.ts";

test("bash", async () => {
    const r = await scriptRunner.runScript("bash", `echo "test"`, {
        stdout: "piped",
        stderr: "piped",
    });

    assert.exists(r);
    assert.equals(r.code, 0);
    assert.equals(r.stdoutAsString, "test\n");
});

test("deno", async () => {
    const r = await scriptRunner.runScript("deno", "console.log('test');", {
        stdout: "piped",
        stderr: "piped",
    });

    assert.exists(r);
    assert.equals(r.code, 0);
    assert.equals(r.stdoutAsString, "test\n");
});

test("node", async () => {
    const r = await scriptRunner.runScript("node", "console.log('test');", {
        stdout: "piped",
        stderr: "piped",
    });

    assert.exists(r);
    assert.equals(r.code, 0);
    assert.equals(r.stdoutAsString, "test\n");
});

test("pwsh", async () => {
    const r = await scriptRunner.runScript("pwsh", "Write-Host 'test'", {
        stdout: "piped",
        stderr: "piped",
    });

    assert.exists(r);
    assert.equals(r.code, 0);
    if (IS_WINDOWS) {
        assert.equals(r.stdoutAsString, "test\r\n");
    } else {
        assert.equals(r.stdoutAsString, "test\n");
    }
});
