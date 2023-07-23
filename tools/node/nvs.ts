import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../mod.ts";

registerExe("nvs", {
    windows: [
        "%USERPROFILE%\\.nvs\\nvs.cmd",
    ],

    linux: [
        "${HOME}/.nvs/nvs",
    ]
});

export function nvs(args?: string[], options?: IExecOptions) {
    return exec("nvs", args, options);
}

nvs.cli = nvs;
nvs.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("nvs", args, options);
}