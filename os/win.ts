import { IS_WINDOWS } from "./constants.ts";

let isProcessElevated: boolean | undefined = false;

export function isWindowsAdmin(): boolean {
    if (isProcessElevated !== undefined) {
        return isProcessElevated;
    }

    if (IS_WINDOWS) {
        try {
            const shell32 = Deno.dlopen(
                "shell32.dll",
                {
                    isUserAnAdmin: {
                        name: "IsUserAnAdmin",
                        parameters: [],
                        result: "bool",
                        nonblocking: false,
                    },
                } as const,
            );

            isProcessElevated = shell32.symbols.isUserAnAdmin();
            shell32.close();
        } catch {
            isProcessElevated = false;
        }
    } else {
        isProcessElevated = false;
    }

    return isProcessElevated;
}
