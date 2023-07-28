import { assert, test } from "../testing/mod.ts";
import { isEnvEnabled, isReadEnabled } from "../testing/deno_permissions.ts";
import { which, whichSync } from "./which.ts";

const hasEnv = await isEnvEnabled();
const hasRead = await isReadEnabled();

test.when(hasEnv && hasRead, "which: found", async () => {
    const gitPath = await which("git");
    assert.exists(gitPath);
});

test.when(hasEnv && hasRead, "which: not found", async () => {
    const gitPath = await which("git-not-found");
    assert.falsey(gitPath, "git-not-found should not be found");
});

test.when(hasEnv && hasRead, "whichSync: found", () => {
    const gitPath = whichSync("git");
    assert.exists(gitPath);
});

test.when(hasEnv && hasRead, "whichSync: not found", () => {
    const gitPath = whichSync("git-not-found");
    assert.falsey(gitPath, "git-not-found should not be found");
});
