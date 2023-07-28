import { ICiEnvProvider } from "../interfaces.ts";
import { cwd } from "../../process/_base.ts";
import { dirname } from "../../path/mod.ts";
import { existsSync } from "../../fs/mod.ts";
import { captureSync } from "../../process/ps.ts";

export class GitProvider implements ICiEnvProvider {
    #isCi?: boolean;

    #ref?: string;

    #refName?: string;

    #sha?: string;

    #artifactsDir?: string;

    get name(): string {
        return "git";
    }

    get isCi(): boolean {
        if (this.#isCi === undefined) {
            this.#isCi = false;
            let target = cwd();
            while (target.length > 0) {
                if (existsSync(`${target}/.git`)) {
                    this.#isCi = true;
                    break;
                }

                target = dirname(target);
            }
        }

        return this.#isCi;
    }

    get ref(): string {
        if (!this.#ref) {
            this.#ref = "";
            const out = captureSync("git", "rev-parse", "--symbolic-full-name", "HEAD");
            if (out.code === 0) {
                const lines = out.stderrAsLines;
                if (lines?.length) {
                    this.#ref = lines[0];
                }
            }
        }

        return this.#ref;
    }

    get refName(): string {
        if (!this.#refName) {
            this.#refName = "";
            const out = captureSync("git", "rev-parse", "--abbrev-ref", "HEAD");
            if (out.code === 0) {
                const lines = out.stderrAsLines;
                if (lines?.length) {
                    this.#refName = lines[0];
                }
            }
        }

        return this.#refName;
    }

    get sha(): string {
        if (!this.#sha) {
            this.#sha = "";
            const out = captureSync("git", "rev-parse", "HEAD");
            if (out.code === 0) {
                const lines = out.stderrAsLines;
                if (lines?.length) {
                    this.#sha = lines[0];
                }
            }
        }

        return this.#sha;
    }

    get artifactsDir(): string {
        return "";
    }

    get buildNumber(): string {
        return "";
    }
}
