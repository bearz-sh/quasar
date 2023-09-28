import { IS_WINDOWS } from "../mod.ts";
import { get } from "../os/env.ts";
import { homeDir } from "../os/os.ts";
import { join } from "./mod.ts";

let configDir: string | undefined = undefined;
let dataDir: string | undefined = undefined;
let globalEtcDir: string | undefined = undefined;

export function etcDir() {
    if (globalEtcDir) {
        return globalEtcDir;
    }

    if (IS_WINDOWS) {
        globalEtcDir = join(get("ALLUSERSPROFILE") || "c:/ProgramData");
    } else {
        globalEtcDir = "/etc";
    }

    return globalEtcDir;
}

export function homeConfigDir(ignoreSudo = true, force = false) {
    if (configDir && !force) {
        return configDir;
    }

    const home = homeDir();

    if (IS_WINDOWS) {
        configDir = get("APPDATA");
        if (configDir) {
            return configDir;
        }

        if (!home) {
            throw new Error("Could not find home directory");
        }

        configDir = join(home, "AppData", "Roaming");
        return configDir;
    }

    const sudoUser = get("SUDO_USER");
    if (!ignoreSudo && sudoUser) {
        configDir = join("/home", sudoUser, ".config");
    } else {
        configDir = get("XDG_CONFIG_HOME");
        if (configDir) {
            return configDir;
        }

        if (!home) {
            throw new Error("Could not find home directory");
        }

        configDir = join(home, ".config");
    }

    return configDir;
}

export function homeDataDir(ignoreSudo = true, force = false) {
    if (dataDir && !force) {
        return dataDir;
    }

    const home = homeDir();

    if (IS_WINDOWS) {
        dataDir = get("LOCALAPPDATA");
        if (dataDir) {
            return dataDir;
        }

        dataDir = join(home, "AppData", "Local");
        return dataDir;
    }

    const sudoUser = get("SUDO_USER");
    if (!ignoreSudo && sudoUser) {
        dataDir = join("/home", sudoUser, ".local", "share");
    } else {
        dataDir = get("XDG_DATA_HOME");
        if (dataDir) {
            return dataDir;
        }

        dataDir = join(home, ".local", "share");
    }

    return dataDir;
}
