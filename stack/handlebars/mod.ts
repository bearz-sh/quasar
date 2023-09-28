import { handlebars } from "./deps.ts";
import { envHelpers } from "./env_helpers.ts";
import { stringHelpers } from "./string_helpers.ts";
import { typeHelpers } from "./type_helpers.ts";

export { envHelpers, handlebars, stringHelpers, typeHelpers };

export function registerDefault(hb?: typeof handlebars) {
    registerHelpers(envHelpers, hb);
    registerHelpers(stringHelpers, hb);
    registerHelpers(typeHelpers, hb);
}

export function registerHelpers(helpers: Record<string, handlebars.HelperDelegate>, hb?: typeof handlebars) {
    if (hb) {
        for (const [k, v] of Object.entries(helpers)) {
            hb.registerHelper(k, v);
        }

        return;
    }

    for (const [k, v] of Object.entries(helpers)) {
        handlebars.registerHelper(k, v);
    }
}
