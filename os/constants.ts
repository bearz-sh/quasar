export type OsFamily =
    | 'unix'
    | 'linux'
    | 'darwin'
    | 'windows'
    | 'sunos'
    | 'freebsd'
    | 'openbsd'
    | 'netbsd'
    | 'aix'
    | 'solaris'
    | 'illumos'
    | 'unknown';
export type RuntimeArch =
    | 'arm'
    | 'arm64'
    | 'ia32'
    | 'mips'
    | 'mipsel'
    | 'ppc'
    | 'ppc64'
    | 's390'
    | 's390x'
    | 'x64'
    | 'x86_64'
    | 'x86'
    | 'aarch'
    | 'aarch64'
    | 'unknown';


export const osType: OsFamily = (() => {
    // deno-lint-ignore no-explicit-any
    const { Deno } = globalThis as any;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    
    // deno-lint-ignore no-explicit-any
    const { navigator } = globalThis as any;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    
    return "linux";
})();
      


export const OS_FAMILY : OsFamily = Deno.build.os;
export const RUNTIME_ARCH : RuntimeArch = Deno.build.arch;
export const IS_UNIX = OS_FAMILY !== 'windows';
export const IS_WINDOWS = OS_FAMILY === 'windows';
export const IS_LINUX = OS_FAMILY === 'linux';
export const IS_DARWIN = OS_FAMILY === 'darwin';
export const PATH_SEPARATOR = IS_WINDOWS ? ';' : ':';
export const DIR_SEPARATOR = IS_WINDOWS ? '\\' : '/';
export const DIR_SEPARATOR_RE = IS_WINDOWS ? /[\\\/]+/ : /\/+/;
export const NEW_LINE = IS_WINDOWS ? '\r\n' : '\n';
export const PATH_SEPARATOR_RE = IS_WINDOWS ? /[;]+/ : /[:]+/;
export const PATH_VAR_NAME = IS_WINDOWS ? 'Path' : 'PATH'
export const HOME_VAR_NAME = IS_WINDOWS ? 'USERPROFILE' : 'HOME';
export const TEMP_VAR_NAME = IS_WINDOWS ? 'TEMP' : 'TMPDIR';
export const USER_VAR_NAME = IS_WINDOWS ? 'USERNAME' : 'USER';
export const HOST_VAR_NAME = IS_WINDOWS ? 'COMPUTERNAME' : 'HOSTNAME';
export const DEV_NULL = IS_WINDOWS ? 'NUL' : '/dev/null';