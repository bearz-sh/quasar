import { ExecutionContext, PackageExecutionContext } from "./tasks/context.ts";
import { setup } from "./tasks/setup.ts";
import { installTools } from "./tasks/tools.ts";
import { preCallHooks } from "../process/mod.ts";
import { unpack } from "./tasks/mod.ts";
import { fromFileUrl, dirname, join } from "../path/mod.ts";

preCallHooks.push((si: IPsStartInfo) => {
    console.log(si.file, si.args.join(" "));
})

const dir = (dirname(fromFileUrl(import.meta.url)));
const traefik = join(dir, "_data", "traefik");


const ctx = await ExecutionContext.create();
const pctx = await PackageExecutionContext.create(ctx, traefik);
await unpack(pctx);
