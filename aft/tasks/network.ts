import { docker } from "../../shell/docker/mod.ts";
import { IExecutionContext } from "../interfaces.ts";

export async function create(ctx: IExecutionContext) {
    const hasAftNetwork = await test(ctx);
    if (hasAftNetwork) {
        return;
    }
    const name = ctx.config.network.name;
    const r = await docker([
        "network", 
        "create", 
        "--driver=bridge",
        `--subnet=${ctx.config.network.subnet}`,
        `--gateway=${ctx.config.network.gateway}`,
        name]);

    r.throwOrContinue();
}

export async function test(ctx: IExecutionContext) {
    const name = ctx.config.network.name;
    const r = await docker(["network", "ls", "--filter", `name=${name}`, "--format", "{{.Name}}"], {
        stdout: "piped",
        stderr: "piped"
    });

    r.throwOrContinue();
    const lines = r.stdoutAsLines;
    return lines.length > 0 && (lines[0].trim() === name);
}

export async function remove(ctx: IExecutionContext) {
    const name = ctx.config.network.name;
    const r = await docker([
        "network", 
        "rm", 
        name]);

    r.throwOrContinue();
}