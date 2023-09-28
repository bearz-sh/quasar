import * as inflections from "../../text/inflections.ts";
import { isNullOrEmpty, isNullOrWhiteSpace, trim, trimEnd, trimStart } from "../../text/str.ts";

export const stringHelpers = {
    trim: function (str: string, chars?: string) {
        return trim(str, chars);
    },
    trimEnd: function (str: string, chars?: string) {
        return trimEnd(str, chars);
    },

    trimStart: function (str: string, chars?: string) {
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

    contains: function <T>(str: string | Array<T>, value: string | T) {
        if (Array.isArray(str)) {
            return str.includes(value as T);
        }

        return str.toString().includes(value as string);
    },
};
