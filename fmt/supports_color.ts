import { IS_WINDOWS, OS_RELEASE } from "../os/constants.ts";
import * as env from "../os/env.ts";
import { isatty, stderr, stdout } from "../process/_base.ts";


// deno-lint-ignore no-explicit-any
const g = globalThis as any;

interface SniffOptions {
    streamIsTTY?: boolean;
    sniffFlags?: boolean;
}

export interface SupportsColorOptions {
    /** Whether or not to use command line arguments to detect color support */
    sniffFlags?: boolean;
  
    /** Override for the automatic detection of whether the stream is a TTY or not */
    streamIsTTY?: boolean;
}
  
export interface ColorSupport {
    level: number;
    /** Basic color support (16 colors) */
    hasBasic: boolean;
    /** 256 color support */
    has256: boolean;
    /** Truecolor support (16 million colors) */
    has16m: boolean;
}

// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
/// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
function hasFlag(flag: string, argv = globalThis.Deno ? globalThis.Deno.args : g.process.argv) {
    const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf('--');
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
    
    
let flagForceColor : number|undefined;
if (
    hasFlag('no-color')
    || hasFlag('no-colors')
    || hasFlag('color=false')
    || hasFlag('color=never')
) {
    flagForceColor = 0;
} else if (
    hasFlag('color')
    || hasFlag('colors')
    || hasFlag('color=true')
    || hasFlag('color=always')
) {
    flagForceColor = 1;
}
    
function envForceColor() {
    const forceColor = env.get("FORCE_COLOR");
    if (forceColor === undefined)
        return undefined;
    if (forceColor === "true")
        return 1;
    if (forceColor === "false")
        return 0;

    return forceColor.length === 0 ? 1 : Math.min(Number.parseInt(forceColor, 10), 3);
}
    
function translateLevel(level: number) {
    if (level === 0) {
        return false;
    }

    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3,
    };
}
    
function _supportsColor(
    writer?: {
        readonly rid: number;
    },
    {
        streamIsTTY,
        sniffFlags = true,
    }: SupportsColorOptions = {}) {

    const noFlagForceColor = envForceColor();
    if (noFlagForceColor !== undefined) {
        flagForceColor = noFlagForceColor;
    }
    

    const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
    if (forceColor === 0) {
        return 0;
    }

    if (sniffFlags) {
        if (hasFlag('color=16m')
            || hasFlag('color=full')
            || hasFlag('color=truecolor')) {
            return 3;
        }

        if (hasFlag('color=256')) {
            return 2;
        }
    }

    // Check for Azure DevOps pipelines.
    // Has to be above the `!streamIsTTY` check.
    if (env.has('TF_BUILD') && env.has('AGENT_NAME')) {
        return 1;
    }

    if (writer && !streamIsTTY && forceColor === undefined) {
        return 0;
    }

    const min = forceColor || 0;

    const term = env.get("TERM");
    if (term === 'dumb') {
        return min;
    }

    if (IS_WINDOWS) {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = OS_RELEASE.split('.');
        if (
            Number(osRelease[0]) >= 10
            && Number(osRelease[2]) >= 10_586
        ) {
            return Number(osRelease[2]) >= 14_931 ? 3 : 2;
        }

        return 1;
    }

    if (env.has("CI")) {
        if (env.has('GITHUB_ACTIONS') || env.has('GITEA_ACTIONS')) {
            return 3;
        }

        if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(sign => env.has(sign)) 
            || env.get("CI_NAME") === 'codeship') {
            return 1;
        }

        return min;
    }

    const teamCityVersion = env.get("TEAMCITY_VERSION");
    if (teamCityVersion) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamCityVersion) ? 1 : 0;
    }

    if (env.get("COLORTERM") === 'truecolor') {
        return 3;
    }

    if (term === 'xterm-kitty') {
        return 3;
    }
    
    const termProgram = env.get("TERM_PROGRAM");
    if (termProgram !== undefined) {
        const version = Number.parseInt((env.get("TERM_PROGRAM_VERSION") || '').split('.')[0], 10);

        switch (termProgram) {
            case 'iTerm.app': {
                return version >= 3 ? 3 : 2;
            }

            case 'Apple_Terminal': {
                return 2;
            }
            // No default
        }
    }

    if (term) {
        if (/-256(color)?$/i.test(term)) {
            return 2;
        }
    
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(term)) {
            return 1;
        }
    }
    

    if (env.has("COLORTERM")) {
        return 1;
    }

    return min;
}

export function createSupportsColor(writer: {
        readonly rid: number;
    },
    options: SupportsColorOptions = { sniffFlags: true}) {
    const level = _supportsColor(writer, {
        streamIsTTY: writer && isatty(writer.rid),
        ...options,
    });

    return translateLevel(level);
}

export interface ISupportsColor {
    stdout: ColorSupport;
    stderr: ColorSupport;
}

export const supportsColor: ISupportsColor = {
    stdout: createSupportsColor(stdout) as ColorSupport,
    stderr: createSupportsColor(stderr) as ColorSupport,
};