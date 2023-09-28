import { basename, extname } from "https://deno.land/std@0.200.0/path/mod.ts";
export * from "https://deno.land/std@0.200.0/path/mod.ts";

export function basenameWithoutExtension(path: string) {
    const ext = extname(path);
    if (ext === "") {
        return basename(path);
    }

    return basename(path, ext);
}
