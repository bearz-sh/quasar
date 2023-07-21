import { PlatformNotSupportedError } from "../../../errors/mod.ts";
import { IS_WINDOWS } from "../../constants.ts";
import { Ptr, Pwstr } from "../../../ptr/mod.ts"


// @ts-ignore using any for


type Advapi32 =  Deno.DynamicLibrary<{
    RegOpenKeyExW: {
        parameters: ["pointer", "buffer", "u32", "u32", "pointer"];
        result: "u32";
        optional: true;
    },

    RegCloseKey: {
        parameters: ["pointer"],
        result: "u32",
        optional: true,
    },
}>


let lib : Advapi32 | undefined = undefined;

function load() : Advapi32 {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("openKey is only supported on Windows")
    }

    if (lib)
        return lib;
    

    const lib1 = Deno.dlopen("ADVAPI32.dll", {

        RegOpenKeyExW: {
            parameters: ["pointer", "buffer", "u32", "u32", "pointer"],
            result: "u32",
            optional: true,
        },

        RegCloseKey: {
            parameters: ["pointer"],
            result: "u32",
            optional: true,
        },

 
    });

    lib1.close
    lib = lib1;

    return lib1;
}

export function close() {
    if (!lib)
        return;

    lib.close();
    lib = undefined;
}

export function closeKey(hKey: Deno.PointerValue) {
    return load().symbols.RegCloseKey!(hKey);
}

/**
 * opens a registry key.
 * 
 * @param hKey Windows.Win32.System.Registry.HKEY
 * @param lpSubKey Windows.Win32.Foundation.PWSTR
 * @param ulOptions u32
 * @param samDesired Windows.Win32.System.Registry.REG_SAM_FLAGS
 * @param phkResult ptr
 * @returns the windows error code as u64 (0 is success).
 */
export function openKey2(
    hKey: Ptr,
    lpSubKey: string | null | Uint8Array | Uint16Array,
    ulOptions: number,
    samDesired: number,
    phkResult: Ptr) {
    const advapi32 = load().symbols
    return advapi32.RegOpenKeyExW!(hKey.value, Pwstr.convertToUtf16(lpSubKey), ulOptions, samDesired, phkResult.value);
}


