import { exec, execSync, IExecOptions, IExecSyncOptions, registerExe } from "../../mod.ts";

registerExe("deno", {
    windows: [
        "%USERPROFILE%\\.deno\\bin\\deno.cmd",
        "%ChocolateyInstall%\\lib\\deno\\deno.exe",
    ],

    linux: [
        "${HOME}/.deno/bin/deno",
    ],
});

export function deno(args?: string[], options?: IExecOptions) {
    return exec("deno", args, options);
}

deno.cli = deno;
deno.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("deno", args, options);
};
