export interface IChocoArgs extends Record<string, unknown> {
    force?: boolean;
    trace?: boolean;
    debug?: boolean;
    yes?: boolean;
    noProgress?: boolean;
}

export interface IChocoInstallArgs extends IChocoArgs {
    name: string;
    version?: string;
    pre?: boolean;
}

export interface IChocoUninstallArgs extends IChocoArgs {
    name: string;
    version?: string;
    pre?: boolean;
}
