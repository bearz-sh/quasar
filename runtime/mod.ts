
// deno-lint-ignore no-explicit-any
const g = globalThis as any;

export const IS_BUN = g.Bun !== undefined;
export const IS_DENO = g.Deno !== undefined;
export const IS_NODELIKE = g.process !== undefined;
export const IS_NODE = !IS_BUN && IS_NODELIKE;
export const IS_BROWSER = g.window !== undefined;

let trace = false;
let debug = false;

if (g.IS_TRACE)
{
    trace = true;
}

if (g.IS_DEBUG)
{
    debug = true;
}

export function isTrace() {
    return trace;
}

export function isDebug() {
    return debug;
}

export const setTrace = (value: boolean) => trace = value;
export const setDebug = (value: boolean) => debug = value;