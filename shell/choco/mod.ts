import { cli, cliSync } from "./cli.ts";
import { IExecOptions, IExecSyncOptions, splat } from "../core/mod.ts";
import { IChocoInstallArgs, IChocoUninstallArgs } from "./interfaces.ts";

export function choco(args: string[], options?: IExecOptions) {
    return cli(args, options);
}

export function chocoSync(args: string[], options?: IExecSyncOptions) {
    return cliSync(args, options);
}

export function install(args: IChocoInstallArgs | string, options?: IExecOptions) {
    if (typeof args === "string") {
        return choco(["install", args, "-y"], options);
    } else {
        const o = args as IChocoInstallArgs;
        o.yes ??= true;

        const params = splat(o, { prefix: "--", command: ["install"] });
        return choco(params, options);
    }
}

export function uninstall(args: IChocoUninstallArgs | string, options?: IExecOptions) {
    if (typeof args === "string") {
        return choco(["uninstall", args, "-y"], options);
    }

    const o = args;
    o.yes ??= true;

    const params = splat(o, { prefix: "--", command: ["uninstall"] });
    return choco(params, options);
}
