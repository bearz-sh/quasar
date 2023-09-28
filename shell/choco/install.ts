import { scriptRunner } from "../core/script_runner.ts";
import { set } from "../../os/env.ts";
import { IS_WINDOWS, PlatformNotSupportedError } from "../../mod.ts";
import { which } from "../../process/which.ts";

/**
 * installs chocolatey
 * @param installDir
 * @param toolsDir
 * @throws PlatformNotSupportedError when running on a non window system.
 * @returns void
 */
export async function install(installDir?: string, toolsDir?: string) {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("Chocolately is only supported on Windows");
    }

    const installed = await isInstalled();
    if (installed) {
        return;
    }

    let envSet = "":
    if (installDir) {
        set("ChocolateyInstall", installDir);
        envSet += `\n[Environment]::SetEnvironmentVariable("ChocolateyInstall", "${installDir}", "User");`;
    }

    if (toolsDir) {
        set("ChocolateyToolsLocation", toolsDir);
        envSet += `\n[Environment]::SetEnvironmentVariable("ChocolateyToolsLocation", "${toolsDir}", "User");`;
    }

    const hasPwsh = (await which("pwsh")) !== undefined;
    const script = `
    ${envSet}
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
`;
    if (hasPwsh) {
        await scriptRunner.runScript("pwsh", script);
    } else {
        await scriptRunner.runScript("powershell", script);
    }
}

export async function isInstalled() {
    return (await which("choco")) !== undefined;
}
