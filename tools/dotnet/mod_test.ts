import { test, assert } from "../../testing/mod.ts";
import { isRunEnabled, isEnvEnabled, isReadEnabled, isWriteEnabled } from "../../testing/deno_permissions.ts";
import { which } from "../../process/which.ts";
import { dotnet, DotNetToolManager } from "./mod.ts";
import { ensureDir, makeTempDirectory } from '../../fs/mod.ts'
import { remove } from "../../fs/fs.ts";


const hasRun = await isRunEnabled();
const hasEnv = await isEnvEnabled();
const hasRead = await isReadEnabled();
const hasWrite = await isWriteEnabled();
const hasRequirements = hasRun && hasEnv && hasRead && await which("dotnet") !== undefined;


test.when(hasRequirements, "dotnet: success", async () => {
    const out = await dotnet(["--version"]);
    assert.equals(out.code, 0);
});

test.when(hasRequirements, "dotnet: failure", async () => {
    const out = await dotnet(["not-a-command"]);
    assert.equals(out.code, 1);
});

test.when(hasRequirements, "dotnet.sync: success", () => {
    const out = dotnet.sync(["--version"]);
    assert.equals(out.code, 0);
});

test.when(hasRequirements, "dotnet.sync: failure", () => {
    const out = dotnet.sync(["not-a-command"]);
    assert.equals(out.code, 1);
});

test.when(hasRequirements, "toolSearch", async () => {
    const manager = new DotNetToolManager();
    const results = await manager.search("dotnet-ef");
    assert.exists(results);
    assert.truthy(results.length > 0);
    assert.ok(results.some(r => r.name === "dotnet-ef"));
});

test.when(hasRequirements && hasWrite, "toolInstall", async () => {
    const tmp = await makeTempDirectory();
    try {
        await ensureDir(tmp);
        console.log(tmp);
        const manager = new DotNetToolManager();
        const results = await manager.install("dotnet-ef", undefined, ["--tool-path", tmp]);
    
        assert.exists(results);
        assert.equals(results.code, 0);

        const tools = await manager.list(undefined, ["--tool-path", tmp]);
        assert.exists(tools);
        assert.truthy(tools.length > 0);
        assert.ok(tools.some(r => r.name === "dotnet-ef"));

        const results2 = await manager.uninstall("dotnet-ef", ["--tool-path", tmp]);
        assert.exists(results2);
        assert.equals(results2.code, 0);

    } finally {
        await remove(tmp, { recursive: true});
    }
});