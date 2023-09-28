import { getOrDefault } from "../os/env.ts";

export const isGenericCI = getOrDefault("CI", "false") === "true";
export const isTfBuild = getOrDefault("TF_BUILD", "false") === "true";
export const isGithub = getOrDefault("GITHUB_ACTIONS", "false") === "true";
export const isGitlab = getOrDefault("GITLAB_CI", "false") === "true";
export const isJenkins = getOrDefault("JENKINS_URL", "") !== "";
export const isCi = isGenericCI || isTfBuild || isGithub || isGitlab || isJenkins;
