// deno-lint-ignore-file no-unused-vars
import {
    exec,
    execSync,
    IExecOptions,
    IExecSyncOptions,
    IPkgInfo,
    IPkgMgr,
    PsOutput,
    registerExe,
    upm,
} from "../../mod.ts";

const findOptions = registerExe("sonarqube", {});

export function sonarqube(args?: string[], options?: IExecOptions) {
    return exec("sonarqube", args, options);
}

sonarqube.cli = sonarqube;
sonarqube.findOptions = findOptions;
sonarqube.sync = function (args?: string[], options?: IExecSyncOptions) {
    return execSync("sonarqube", args, options);
};
