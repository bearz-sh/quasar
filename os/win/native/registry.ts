import { PlatformNotSupportedError } from "../../../errors/mod.ts";
import { IS_WINDOWS } from "../../constants.ts";
import { convertToWideStringBuffer } from "./core.ts";
import { Ptr } from "../../../ffi/mod.ts";

// @ts-ignore using any for
type Advapi32 = Deno.DynamicLibrary<{
    RegOpenKeyExW: {
        parameters: ["pointer", "buffer", "u32", "u32", "pointer"];
        result: "u32";
        optional: true;
    };

    RegEnumKeyExW: {
        parameters: ["pointer", "u32", "buffer", "pointer", "pointer", "buffer", "pointer", "pointer"];
        result: "u32";
        optional: true;
    };

    RegCloseKey: {
        parameters: ["pointer"];
        result: "u32";
        optional: true;
    };
}>;

let lib: Advapi32 | undefined = undefined;

function load(): Advapi32 {
    if (!IS_WINDOWS) {
        throw new PlatformNotSupportedError("openKey is only supported on Windows");
    }

    if (lib) {
        return lib;
    }

    const lib1 = Deno.dlopen("ADVAPI32.dll", {
        RegConnectRegistryW: {
            parameters: ["buffer", "pointer", "pointer"],
            result: "u32",
            optional: true,
        },

        RegQueryValueExW: {
            parameters: ["pointer", "buffer", "pointer", "pointer", "pointer", "pointer"],
            result: "u32",
            optional: true,
        },

        RegOpenKeyExW: {
            parameters: ["pointer", "buffer", "u32", "u32", "pointer"],
            result: "u32",
            optional: true,
        },

        RegSetValueExW: {
            parameters: ["pointer", "buffer", "u32", "u32", "pointer", "u32"],
            result: "u32",
            optional: true,
        },

        RegEnumKeyExW: {
            parameters: ["pointer", "u32", "buffer", "pointer", "pointer", "buffer", "pointer", "pointer"],
            result: "u32",
            optional: true,
        },

        RegCloseKey: {
            parameters: ["pointer"],
            result: "u32",
            optional: true,
        },
    });

    lib1.close;
    lib = lib1;

    return lib1;
}

export function close() {
    if (!lib) {
        return;
    }

    lib.close();
    lib = undefined;
}

export function closeKey(hKey: Ptr) {
    return load().symbols.RegCloseKey!(hKey.value);
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
    phkResult: Ptr,
) {
    const advapi32 = load().symbols;
    return advapi32.RegOpenKeyExW!(
        hKey.value,
        convertToWideStringBuffer(lpSubKey),
        ulOptions,
        samDesired,
        phkResult.value,
    );
}
