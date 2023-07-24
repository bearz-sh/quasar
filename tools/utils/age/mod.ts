// deno-lint-ignore-file no-unused-vars
import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe,
    upm,
    IPkgInfo,
    IPkgMgr,
    PsOutput
} from "../../mod.ts";

const findOptions = registerExe("age", {});
const findOptionsKeygen = registerExe("age-keygen", {});

export function age(args?: string[], options?: IExecOptions) {
    return exec("age", args, options);
}

age.cli = age;
age.findOptions = findOptions;
age.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("age", args, options);
}

export function ageKeygen(args?: string[], options?: IExecOptions) {
    return exec("age-keygen", args, options);
}

ageKeygen.cli = ageKeygen;
ageKeygen.findOptions = findOptionsKeygen;
ageKeygen.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("age-keygen", args, options);
}