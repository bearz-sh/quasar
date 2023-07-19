import { handlebars } from "./deps.ts";
import { trimEnd, trimStart, trim, isNullOrEmpty, isNullOrWhiteSpace } from "../str.ts";
import * as inflections from 'npm:inflection@2.0.1';
import * as os from '../os/mod.ts';




const stringHelpers = {
   
    trim: function (str: string, chars?: string) {
        return trim(str, chars);
    },
    trimEnd: function (str: string, chars?: string) {
        return trimEnd(str, chars);
    },

    trimStart: function(str: string, chars?: string) {
        return trimStart(str, chars);
    },

    quote: function (v: unknown) {
        return `"${v}"`;
    },

    squote: function (v: unknown) {
        return `'${v}'`;
    },

    join: function (sep: string, ...args: unknown[]) {
        return args.join(sep);
    },

    "is-null": function (v: unknown) {
        return v === null || v === undefined;
    },

    "is-empty": function (str: string) {
        return isNullOrEmpty(str);
    },

    "is-whitespace": function (str: string) {
        return isNullOrWhiteSpace(str);
    },

    lower: function (str: string) {
        return str.toLowerCase();
    },

    upper: function (str: string) {
        return str.toUpperCase();
    },

    pluralize: function (str: string) {
        return inflections.pluralize(str); 
    },

    singularize: function (str: string) {
        return inflections.pluralize(str); 
    },

    titleize: function (str: string) {
        return inflections.titleize(str); 
    },

    dasherize: function (str: string) {
        return inflections.dasherize(str);
    },

    camelize: function (str: string) {
        return inflections.camelize(str);
    },

    underscore: function (str: string) {
        return inflections.underscore(str);
    },

    humanize: function (str: string) {
        return inflections.humanize(str);
    },

    contains: function<T>(str: string | Array<T>, value: string | T) {
        if (Array.isArray(str)) {
            return str.includes(value as T);
        }

        return str.toString().includes(value as string);
    }

}




export function registerStringHelpers(hb?: typeof handlebars) {
    if (hb) {
        for (const [k, v] of Object.entries(stringHelpers)) {
            hb.registerHelper(k, v);
        }
        return hb;
    }

    for (const [k, v] of Object.entries(stringHelpers)) {
        handlebars.registerHelper(k, v);
    }
}


export function registerEnvHelpers(hb?: typeof handlebars) {
    const ev = os.toObject();
    const envHelpers = {
        'env-get': function (v: string) {
            return ev[v];
        },
    
        'env-has': function (v: string) {
            return ev[v] !== undefined;
        },
    
        'env-set': function (k: string, v: string) {
            ev[k] = v;
        }
    }
    

    if (hb) {
        for (const [k, v] of Object.entries(envHelpers)) {
            hb.registerHelper(k, v);
        }
        return hb;
    }

    for (const [k, v] of Object.entries(envHelpers)) {
        handlebars.registerHelper(k, v);
    }
}

export function create() {
    const hb = handlebars.create();
    registerStringHelpers(hb);
    registerEnvHelpers(hb);
    return hb;
}