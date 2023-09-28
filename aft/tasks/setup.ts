import { exists, readTextFile } from "../../fs/fs.ts";
import { ensureDirectory, writeTextFile } from "../../mod.ts";
import { join } from "../../path/mod.ts";
import { which } from "../../process/which.ts";
import { caRootDir, generate, mkcert } from "../../shell/mkcert/mod.ts";
import { createAgeKey } from "../../shell/sops/mod.ts";
import { save } from "../config/mod.ts";
import { IExecutionContext } from "../interfaces.ts";
import { create } from "./network.ts";

export async function setupLocalCerts(ctx: IExecutionContext) {
    const certsDir = join(ctx.config.paths.data, "etc", "certs");
    const cert = join(certsDir, "aft.pem");
    const key = join(certsDir, "aft.key.pem");
    const chained = join(certsDir, "aft.chained.pem")
    const mkcertLocation = await which("mkcert");
    if (!mkcertLocation) {
        return { cert, chained, key };
    }

    await ensureDirectory(certsDir);
   

    const rootDir = await caRootDir();
    console.log(rootDir);
    const rootCert = join(rootDir, "rootCA.pem");
    console.log(rootCert);
    if (!await exists(rootCert)) {
        await mkcert(["-install"]);
    }
   ;
    if (!await exists(cert) || !await exists(key)) {
        await generate({
            domains: ctx.config.mkcert.domains,
            certPath: cert,
            keyPath: key,
        }).then(o => o.throwOrContinue());
    }

    const chainedContent = await readTextFile(cert) + await readTextFile(rootCert);
    await writeTextFile(chained, chainedContent);

    return { cert, chained, key };
}

export async function setup(ctx: IExecutionContext) {
    const tools = ["docker", "mkcert", "age", "sops"];

    const toolsEnabled : Record<string, boolean> = {
        "docker": true,
        "mkcert": true,
        "age": true,
        "sops": true,
    }

    for (const tool of tools) {
        if (!await which(tool)) {
            ctx.host.warn(`${tool} not installed.`)
            toolsEnabled[tool] = false
        }
    }

    if (toolsEnabled["sops"] && toolsEnabled["age"]) {
        ctx.config.sops.enabled = true;

        try {
            ctx.host.info("Setting up sops")
            const { pubKeyFile} = await createAgeKey()
            const pubKey = await readTextFile(pubKeyFile);
            ctx.config.sops.recipient = pubKey;
            await save(ctx.config);
        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                ctx.host.error(e);
            } else {
                ctx.host.error(`Unknown error setting up sops. ${e}`);
            }
        }
    }

    if (toolsEnabled["mkcert"]) {
        ctx.host.info("Setting mkcert");
        ctx.host.error("test");
        await setupLocalCerts(ctx).catch(err => {
            if (err instanceof Error) {
                ctx.host.info(err);
                ctx.host.error(err);
            } else {
                ctx.host.error(`Unknown error setting up local certs. ${err}`);
            }
        })
    }

    if (toolsEnabled["docker"]) {
        console.log("Setting up docker");
        await create(ctx).catch(err => {
            if (err instanceof Error) {
                ctx.host.error(err);
            } else {
                ctx.host.error(`Unknown error setting up local network. ${err}`);
            }
        });
    }
}