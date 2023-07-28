export async function isEnvEnabled() {
    return (await Deno.permissions.query({ name: "env" })).state === "granted";
}

export async function isRunEnabled() {
    return (await Deno.permissions.query({ name: "run" })).state === "granted";
}

export async function isReadEnabled() {
    return (await Deno.permissions.query({ name: "read" })).state === "granted";
}

export async function isWriteEnabled() {
    return (await Deno.permissions.query({ name: "write" })).state === "granted";
}

export async function isNetEnabled() {
    return (await Deno.permissions.query({ name: "net" })).state === "granted";
}

export async function isFFIEnabled() {
    return ((await Deno.permissions.query({ name: "ffi" })).state === "granted");
}
