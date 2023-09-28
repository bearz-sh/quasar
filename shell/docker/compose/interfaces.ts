export interface IComposeArgs extends Record<string, unknown> {
    envFile?: string[] | string;
    file?: string[] | string;
    profile?: string[] | string;
    projectName?: string;
    ansi?: "never" | "always" | "auto";
    projectDirectory?: string;
}

export interface IComposeUpArgs extends IComposeArgs {
    services?: string[] | string;
    /**
     *  Detached mode: Run containers in the background
     */
    detach?: boolean;
    noRecreate?: boolean;
    noBuild?: boolean;
    timeout?: number;
    /**
     *  running|healthy. Implies detached mode.
     */
    wait?: boolean;
    removeOrphans?: boolean;
}

export interface IComposeDownArgs extends IComposeArgs {
    services?: string[] | string;
    /**
     *  Remove named volumes declared in the `volumes` section of the Compose file and anonymous volumes
     *  attached to containers.
     */
    volumes?: boolean;
    /**
     *  Remove containers for services not defined in the Compose file
     */
    removeOrphans?: boolean;

    /**
     *  Specify a shutdown timeout in seconds (default 10)
     */
    timeout?: number;
}
