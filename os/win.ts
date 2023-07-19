import { IS_WINDOWS } from "./constants.ts";


let isAdminImpl: () => boolean = () => false;

if (IS_WINDOWS) {
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

    isAdminImpl = () => shell32.symbols.isUserAnAdmin();
}



export function isWindowsAdmin(): boolean {
    return isAdminImpl();
}