import { DockerArgs } from "./base.ts";

export interface DockerTrustInspectArgs extends DockerArgs {
    name: string;
    pretty?: boolean;
}

export interface DockerTrustSignArgs extends DockerArgs {
    name: string;
    local?: boolean;
    password?: string;
    repository?: string;
    repositoryKey?: string;
    repositoryPassphrase?: string;
    repositoryRoot?: string;
    repositoryURL?: string;
    remote?: boolean;
    tuf?: boolean;
    tufRepository?: string;
    tufRepositoryKey?: string;
    tufRepositoryPassphrase?: string;
    tufRepositoryRoot?: string;
    tufRepositoryURL?: string;
}

export interface DockerTrustSignerAddArgs extends DockerArgs {
    name: string;
    password?: string;
    repository?: string;
    repositoryKey?: string;
    repositoryPassphrase?: string;
    repositoryRoot?: string;
    repositoryURL?: string;
    tuf?: boolean;
    tufRepository?: string;
    tufRepositoryKey?: string;
    tufRepositoryPassphrase?: string;
    tufRepositoryRoot?: string;
    tufRepositoryURL?: string;
}

export interface DockerTrustSignerRemoveArgs extends DockerArgs {
    name: string;
    tuf?: boolean;
}

export interface DockerTrustSignerRotateArgs extends DockerArgs {
    name: string;
    password?: string;

    repository?: string;
    repositoryKey?: string;
    repositoryPassphrase?: string;
    repositoryRoot?: string;
    repositoryURL?: string;
}

export interface DockerTrustSignerSetArgs extends DockerArgs {
    name: string;
    password?: string;
}
