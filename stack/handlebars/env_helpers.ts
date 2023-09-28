import { get, has, set } from "../../os/env.ts";

export const envHelpers = {
    "env-get": function (v: string) {
        return get(v);
    },

    "env-has": function (v: string) {
        return has(v);
    },

    "env-set": function (k: string, v: string) {
        set(k, v);
    },
};
