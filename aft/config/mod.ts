import { dirname, join } from "../../path/mod.ts";
import { IAftConfig } from "../interfaces.ts";
import { paths } from "../_paths.ts";
import { exists, makeDirectory, readTextFile, writeTextFile, } from "../../fs/mod.ts";


export function createDefaults() {
    const settings : IAftConfig = {
        paths: {
            data: paths.userDataDir.replace(/\\/g, "/"),
            config: paths.userConfigDir.replace(/\\/g, "/"),
        },
        sops: {
            enabled: true,
        },
        defaults: {
            dns: {
                domain: "aft.bearz.casa"
            },
            tz: "UTC",
            puid: 0,
            guid: 0,
            networks: {
                default: {
                    cidr: [172, 19, 0, 0],
                    name: "aft",
                }
            },
        },
        network: {
            name: "aft",
            subnet: "172.19.0.0/20",
            gateway: "172.19.0.1"
        },
        mkcert: {
            domains: [
                "*.aft.bearz.casa",
                "aft.bearz.casa",
                "localhost",
            ]
        }
    };

    return settings;
}

export async function load(path?: string) {
    let dir = "";
    if (path === undefined) {
        dir = paths.userConfigDir;
        path = join(dir, "aft.config");
    } else {
        dir = dirname(path);
    }
    if (!await exists(path!)) {
        await makeDirectory(dir, { recursive: true });

        const settings = createDefaults();
        const json = JSON.stringify(settings, null, 4);
        await writeTextFile(path!, json);

        return settings;
    }

    const json = await readTextFile(path!);
    const settings = JSON.parse(json) as IAftConfig;
    return settings;
}

export async function save(config: IAftConfig, path?: string) {
    if (!path) {
        path = join(paths.userConfigDir, "aft.config");
    }
    const dir = dirname(path!);
    if (!await exists(dir)) {
        await makeDirectory(dir, { recursive: true });
    }
   
    const json = JSON.stringify(config, null, 4);
    await writeTextFile(path!, json);
}