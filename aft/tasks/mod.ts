import { parseYaml } from "../../deps.ts";
import { copy, ensureDirectory, exists, readTextFile } from "../../fs/fs.ts";
import { secretMasker, writeTextFile } from "../../mod.ts";
import { expand, set } from "../../os/env.ts";
import { which } from "../../process/which.ts";
import { dirname, join } from "../../path/mod.ts";
import { SecretGenerator } from "../../secrets/generator.ts";
import { IComposeUpArgs, up as upInternal, down as downInternal, IComposeDownArgs } from "../../shell/docker/compose/mod.ts";
import { sops } from "../../shell/sops/mod.ts";
import { handlebars, registerDefault } from "../../stack/handlebars/mod.ts";
import { ValueBuilder } from "../_value_builder.ts";
import { IPackageExecutionContext, ISecretsSection } from "../interfaces.ts";

async function generateEnvFile(ctx: IPackageExecutionContext, vb: ValueBuilder, secretsFile?: string) {
    secretsFile ??= ctx.package.secretsFile

    if (!await exists(secretsFile)) {
        return;
    }

    const service = ctx.package.spec.service ?? ctx.package.spec.name;
    const composeDir = join(ctx.config.paths.data, "etc", "compose", service);
    const envFile = join(composeDir, ".env");
    
    const content = await readTextFile(secretsFile);
    const sections = parseYaml(content) as ISecretsSection[];
    let envText = "";
    const env : Record<string, string | undefined> = {};
    for(let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (!s.path || s.path.length === 0) {
            ctx.host.warn(`Secrets section ${i} has no path`);
            continue;
        }
        let secret = await ctx.secretStore.get(s.path);
        if (secret === undefined) {
            if (s.default) {
                secret = s.default;
                await ctx.secretStore.set(s.path, secret);
            }

            if (!s.create)
            {
                ctx.host.warn(`Secret ${s.path} has no value`);
                continue;
            }
           
            const sg = new SecretGenerator();
            sg.addDefaults();
            secret = sg.generate(s.length ?? 16);
            await ctx.secretStore.set(s.path, secret);
        }

        secretMasker.add(secret);
        env[s.name] = secret;
        if (secret.includes('"'))
            envText += `${s.name}='${secret}'\n`;
        else 
            envText += `${s.name}="${secret}"\n`;
    }

    vb.add({ secrets: env });
    await ensureDirectory(composeDir);

    await writeTextFile(envFile, envText);
    if (ctx.config.sops.enabled && ctx.config.sops.recipient) {
        await sops(["-e", envFile, "-i", envFile]);
    }
}

async function walk(src: string, dest: string, hb: typeof handlebars, locals: Record<string, unknown>) {
    for await (const entry of Deno.readDir(src)) {
        const path = join(src, entry.name);
        if (entry.isDirectory) {
            await walk(path, join(dest, entry.name), hb, locals);
        } else {
            await ensureDirectory(dest);

            let destPath = join(dest, entry.name);
            if (path.endsWith(".hbs")) { 
                destPath = destPath.substring(0, destPath.length - 4);
                if (await exists(destPath)) {
                    continue;
                }

                const tplContent = await readTextFile(path);
                const tpl = hb.compile(tplContent);
                const content = tpl(locals);
                
                await writeTextFile(destPath, content);
                continue;
            }

            if (await exists(destPath)) {
                continue;
            }

            await copy(path, destPath, { overwrite: true });
        }
    }
}

export async function unpack(ctx: IPackageExecutionContext, valueFiles?: string[], secretsFile?: string) {
    const vb = new ValueBuilder();
    vb.addDefaults(ctx);
    if (valueFiles) {
        await vb.addYamlFile(valueFiles);
    }

    const locals = vb.build();
    const composeFile = ctx.package.composeFile;
    const service = ctx.package.spec.service ?? ctx.package.spec.name;
    const composeDir = join(ctx.config.paths.data, "etc", "compose", service);

    await ensureDirectory(composeDir);

    await generateEnvFile(ctx, vb, secretsFile);

    const hbs = handlebars.create();
    registerDefault(hbs);
    const template = await readTextFile(composeFile);
    const dir = dirname(composeFile);
    const content = hbs.compile(template)(locals);
    const outFile = join(composeDir, "compose.yaml");
    await writeTextFile(outFile, content);

    if (locals.volumes) {
        const volumes = locals.volumes as Record<string, unknown>;
        for(const key in volumes) {
            let value = volumes[key] as string;
            value = expand(value);
            volumes[key] = value;

            if (!value || value.length === 0)
                continue;

            const childDir = join(dir, key);
            if (await exists(childDir)) {
                await walk(childDir, value, handlebars, locals)   
            }
        }
    }
}

export async function up(ctx: IPackageExecutionContext) {
    const service = ctx.package.spec.service ?? ctx.package.spec.name;
    const composeDir = join(ctx.config.paths.data, "etc", "compose", service);
    const composeFile = join(composeDir, "compose.yaml");
    const envFile = join(composeDir, ".env");

    const args : IComposeUpArgs = {
        projectDirectory: composeDir,
        file: [composeFile],
        wait: true,
    }

    let useSops = ctx.config.sops.enabled && 
        ctx.config.sops.recipient !== undefined &&
        await which("sops") !== undefined;

    if (await exists(envFile)) {
        args.envFile =[envFile];

        if (useSops) {
            set("SOPS_AGE_RECIPIENTS", ctx.config.sops.recipient!);
            await sops(["-d", envFile, "-i", envFile]);
        }
    } else {
        useSops = false;
    }

    try {
        await upInternal(args);
    } finally {
        if (useSops) {
            await sops(["-e", envFile, "-i", envFile]);
        }
    }
}

export async function down(ctx: IPackageExecutionContext) {
    const service = ctx.package.spec.service ?? ctx.package.spec.name;
    const composeDir = join(ctx.config.paths.data, "etc", "compose", service);
    const composeFile = join(composeDir, "compose.yaml");
    const envFile = join(composeDir, ".env");

    const args : IComposeDownArgs = {
        projectDirectory: composeDir,
        file: [composeFile],
        timeout: 60,
    }

    let useSops = ctx.config.sops.enabled && 
        ctx.config.sops.recipient !== undefined &&
        await which("sops") !== undefined;

    if (await exists(envFile)) {
        args.envFile =[envFile];

        if (useSops) {
            set("SOPS_AGE_RECIPIENTS", ctx.config.sops.recipient!);
            await sops(["-d", envFile, "-i", envFile]);
        }
    } else {
        useSops = false;
    }

    try {
        await downInternal(args);
    } finally {
        if (useSops) {
            await sops(["-e", envFile, "-i", envFile]);
        }
    }
}