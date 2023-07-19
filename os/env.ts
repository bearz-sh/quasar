import { IS_DENO, IS_NODELIKE } from "../runtime/mod.ts";
import {  PATH_SEPARATOR, PATH_VAR_NAME } from './constants.ts'

export const secrets : string[] = [];

let vars : { [key: string] : string | undefined } = {};

if (IS_NODELIKE) {
    // deno-lint-ignore no-explicit-any
    const { process } = globalThis as any;
    vars = process.env;
} else  {
    vars["HOME"] = '/';
}

/** 
 * Get the value of an environment variable.
 * 
 * @param key The name of the environment variable.
 * @returns The value of the environment variable, or undefined if it is not set.
 */
let getVar = (key: string) : string | undefined => vars[key];
let setVar = (key: string, value: string) : void => { vars[key] = value };
let removeVar = (key: string) : void => { delete vars[key] };
let hasVar = (key: string) : boolean => vars[key] !== undefined;
let getObject = () : Record<string, string | undefined> => Object.assign({}, vars);


if (IS_DENO) {
    getVar = (key: string) : string | undefined => Deno.env.get(key);
    setVar = (key: string, value: string) : void => { Deno.env.set(key, value) };
    removeVar = (key: string) : void => { Deno.env.delete(key) };
    hasVar = (key: string) : boolean => Deno.env.get(key) !== undefined;
    getObject = () :  Record<string, string | undefined>  => Deno.env.toObject();
}


export const get = getVar;

export function getOrDefault(key: string, defaultValue: string) : string {
    const value = getVar(key);
    if (value === undefined)
        return defaultValue;

    return value;
}   

export function getRequired(key: string) : string {
    const value = getVar(key);
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is required.`);
    }
    return value;
}

export function set(key: string, value: string) : void;
export function set(key: string, value: string, isSecret: boolean) : void;
export function set(map: { [key: string] : string }) : void;
export function set() : void {

    switch(arguments.length) {
        case 1:
            {
                const map = arguments[0] as { [key: string] : string };
                for (const key in map)
                {
                    const value = map[key];
                    setVar(key, value);
                }
               
            }
        
            break;
       

        case 2:
            {
                const key = arguments[0] as string;
                const value = arguments[1] as string;
                setVar(key, value);
            }

            break;

        case 3:
            {
                const key = arguments[0] as string;
                const value = arguments[1] as string;
                const isSecret = arguments[2] as boolean;
                if (isSecret && !secrets.includes(value)) {
                    secrets.push(value);
                }

                setVar(key, value);
            }

            break;

        default:
            throw new Error("Invalid number of arguments.");
    }
}

export const remove = removeVar;
export const has = hasVar;
export const toObject = getObject;

export interface IEnvSubstitutionOptions {
    windowsExpansion?: boolean;
    unixExpansion?: boolean;
    unixAssignment?: boolean;
    unixCustomErrorMessage?: boolean;
    unixArgsExpansion?: boolean;
    getVariable?: (key: string) => string | undefined;
    setVariable?: (key: string, value: string) => void;
}

enum TokenKind {
    None,
    Windows,
    BashVariable,
    BashInterpolation,
}

const dollar = 36;
const openBrace = 123;
const closeBrace = 125;
const percent = 37;
const min = 0;
const backslash = 92;

function isLetterOrDigit(c: number): boolean {
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57);
}


function isValidBashVariable(value: string) {
    
    for(let i = 0; i < value.length; i++) {
        const c = value.charCodeAt(i);

        if (i == 0 && !((c >= 65 && c <= 90) || (c >= 97 && c <= 122)))
            return false;

        if (!isLetterOrDigit(c) && c != 95)
            return false;

    }

    return true;
}

function toCharArray(value: string) {

    const output: number[] = [];
    for (let i = 0; i < value.length; i++) {
        output.push(value.charCodeAt(i));
    }

    return output;
}

export function expand(template: string, options?: IEnvSubstitutionOptions): string {
    if (typeof template !== 'string' || template.length === 0)
        return "";

    const o = options ?? {
        windowsExpansion: true,
        unixExpansion: true,
        unixAssignment: true,
        unixCustomErrorMessage: true,
        unixArgsExpansion: true,
    };
    const getValue = o.getVariable ?? ((name: string) => get(name));
    const setValue = o.setVariable ?? ((name: string, value: string) => set(name, value));
    const tokenBuilder: number[] = [];
    const output : number[] = [];
    let kind = TokenKind.None;
    let remaining = template.length;
    for (let i = 0; i < template.length; i++) {
        remaining--;
        const c = template.charCodeAt(i);
        if (kind === TokenKind.None) {
            if (o.windowsExpansion && c === percent) {
                kind = TokenKind.Windows;
                continue;
            }

            if (o.unixExpansion) {

                const z = i + 1;
                let next = min;
                if (z < template.length)
                    next = template.charCodeAt(z);

                // escape the $ character.
                if (c === backslash && next === dollar) {
                    output.push(dollar);
                    i++;
                    continue;
                }

                if (c === dollar) {
                    // can't be a variable if there is no next character.

                    if (next === openBrace && remaining > 3) {
                        kind = TokenKind.BashInterpolation;
                        i++;
                        remaining--;
                        continue;
                    }

                    // only a variable if the next character is a letter.
                    if (remaining > 0 && isLetterOrDigit(next)) {
                        kind = TokenKind.BashVariable;
                        continue;
                    }

                }

            }

            output.push(c);
            continue;

        }

        if (kind === TokenKind.Windows && c === percent) {
            if (tokenBuilder.length === 0) {
                // consecutive %, so just append both characters.
               output.push(percent, percent);
                continue;
            }

            const key = tokenBuilder.join("");
            const value = getValue(key);
            if (value !== undefined && value.length > 0)
                output.push(...toCharArray(value));
            tokenBuilder.length = 0;
            kind = TokenKind.None;
            continue;
        }

        if (kind === TokenKind.BashInterpolation && c === closeBrace) {
            if (tokenBuilder.length === 0) {
                // with bash '${}' is a bad substitution.
                throw new Error("${} is a bad substitution. Variable name not provided.");
            }

            const substitution = String.fromCharCode(...tokenBuilder);
            let key = substitution;
            let defaultValue = "";
            let message: string | undefined = undefined;
            if (substitution.includes(":-")) {
                const parts = substitution.split(":-");
                key = parts[0];
                defaultValue = parts[1];
            } else if (substitution.includes(":=")) {
                const parts = substitution.split(":=");
                key = parts[0];
                defaultValue = parts[1];

                if (o.unixAssignment) {
                    const v = getValue(key);
                    if (v === undefined)
                        setValue(key, defaultValue);    
                }

            } else if (substitution.includes(":?")) {
                const parts = substitution.split(":?");
                key = parts[0];
                if (o.unixCustomErrorMessage) {
                    message = parts[1];
                }
            } else if (substitution.includes(":")) {
                const parts = substitution.split(":");
                key = parts[0];
                defaultValue = parts[1];
            }

            if (key.length === 0) {
                throw new Error("Bad substitution, empty variable name.");
            }

            if (!isValidBashVariable(key)) {
                throw new Error(`Bad substitution, invalid variable name ${key}.`);
            }

            const value = getValue(key);
            if (value !== undefined)
                output.push(...toCharArray(value));

            else if (message !== undefined)
                throw new Error(message);

            else if (defaultValue.length > 0)
            output.push(...toCharArray(defaultValue));

            else
                throw new Error(`Bad substitution, variable ${key} is not set.`);

            tokenBuilder.length = 0;
            kind = TokenKind.None;
            continue;
        }

        if (kind === TokenKind.BashVariable && (isLetterOrDigit(c) || remaining === 0)) {
            // '\' is used to escape the next character, so don't append it.
            // its used to escape a name like $HOME\\_TEST where _TEST is not
            // part of the variable name.
            let append = c !== backslash;

            if (remaining === 0 && isLetterOrDigit(c)) {
                append = false;
                tokenBuilder.push(c);
            }

            // rewind one character. Let the previous block handle $ for the next variable
            if (c === dollar) {
                append = false;
                i--;
            }

            const key = tokenBuilder.join("");
            if (key.length === 0) {
                throw new Error("Bad substitution, empty variable name.");
            }

            const index = parseInt(key);
            if (o.unixArgsExpansion && !isNaN(index)) {
                if (index < 0 || index >= Deno.args.length)
                    throw new Error(`Bad substitution, invalid index ${index}.`);

                output.push(...toCharArray(Deno.args[index]));
                if (append)
                    output.push(c);

                tokenBuilder.length = 0;
                kind = TokenKind.None;
                continue;
            }

            if (!isValidBashVariable(key)) {
                throw new Error(`Bad substitution, invalid variable name ${key}.`);
            }

            const value = getValue(key);
            if (value !== undefined && value.length > 0)
                output.push(...toCharArray(value));

            if (value === undefined)
                throw new Error(`Bad substitution, variable ${key} is not set.`);

            if (append)
                output.push(c);

            tokenBuilder.length = 0;
            kind = TokenKind.None;
            continue;
        }


        tokenBuilder.push(c);
        if (remaining === 0) {
            if (kind === TokenKind.Windows)
                throw new Error("Bad substitution, missing closing token '%'.");

            if (kind === TokenKind.BashInterpolation)
                throw new Error("Bad substitution, missing closing token '}'.");
        }
    }

    return String.fromCharCode(...output);
}



export function splitPath(): string[] {
    const path = getRequired(PATH_VAR_NAME);
    return path.split(PATH_SEPARATOR);
}

export function getPath(): string {
    return getRequired(PATH_VAR_NAME);
}

export function setPath(path: string): void {
    setVar(PATH_VAR_NAME, path);
}

export function hasPath(path: string): boolean {
    return splitPath().includes(path);
}

export function addPath(path: string, prepend = false): void {
    const paths = splitPath();
    if (prepend) {
        paths.unshift(path);
    } else {
        paths.push(path);
    }
    setVar(PATH_VAR_NAME, paths.join(PATH_SEPARATOR));
}

export function removePath(path: string): void {
    const paths = splitPath();
    const index = paths.indexOf(path);
    if (index !== -1) {
        paths.splice(index, 1);
        setVar(PATH_VAR_NAME, paths.join(PATH_SEPARATOR));
    }
}

export const path = {
    split: splitPath,
    get: getPath,
    set: setPath,
    has: hasPath,
    add: addPath,
    remove: removePath
}