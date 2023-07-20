import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    registerExe 
} from "../../process/exec.ts";

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
nvs.cliSync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("nvs", args, options);
}