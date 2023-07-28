import { assert, test } from "../testing/mod.ts";
import { isReadEnabled } from "../testing/deno_permissions.ts";
import { chdir, cwd } from "./_base.ts";

const hasRead = await isReadEnabled();

test.when(hasRead, "cwd: returns directory", () => {
    const dir = cwd();
    assert.exists(dir);
});

test.when(hasRead, "chdir: changes directory", () => {
    const dir = cwd();
    try {
        const newDir = Deno.build.os === "windows" ? "C:\\" : "/";
        chdir(newDir);
        assert.equals(cwd(), newDir);
    } finally {
        chdir(dir);
    }
});
