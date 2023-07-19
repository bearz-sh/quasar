import { Char } from './char.ts';

export const EMPTY = '';

export function trimEnd(str: string, chars: string = EMPTY): string {
    let size = str.length;

    if (chars === EMPTY) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (Char.isWhiteSpaceAt(str, i)) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(0, size);
    }

    if (chars.length === 1) {
        const c = chars.charCodeAt(0);
        for (let i = str.length - 1; i >= 0; i--) {
            if (chars.charCodeAt(0) === c) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(0, size);
    }

    let j = chars.length;
    const codes = toCharCodeArray(chars);

    for (let i = str.length - 1; i >= 0; i--) {
        j--;
        if (str.charCodeAt(i) === codes[j]) {
            if (j === 0) {
                j = chars.length;
                size = size - j;
            }

            continue;
        } else {
            break;
        }
    }

    if (size === str.length) {
        return str;
    }

    return str.substring(0, size);
}

export function startsWithIgnoreCase(str: string, search: string, start = 0, locales?: string | string[]) {
    const searchLen = search.length;
    const strLen = str.length;

    if (strLen === 0 || searchLen === 0 || searchLen > strLen) {
        return false;
    }

    let i = start;
    while (i <= strLen - searchLen) {
      let j = 0;
      while (j < searchLen && str[i + j].localeCompare(search[j], locales, { sensitivity: 'accent' }) === 0) {
        j++;
      }
      if (j === searchLen) {
        return true;
      }
      i++;
    }
    return false;
}

export function endsWithIgnoreCase(str: string, search: string, end = str.length, locales?: string | string[]) {
    const searchLen = search.length;
    const strLen = str.length;

    if (strLen === 0 || searchLen === 0 || searchLen > strLen) {
        return false;
    }

    let i = end - searchLen;
    while (i >= 0) {
        let j = 0;
        while (j < searchLen && str[i + j].localeCompare(search[j], locales, { sensitivity: 'accent' }) === 0) {
            j++;
        }
        if (j === searchLen) {
            return true;
        }
        i--;
    }
    return false;
}



export function trimStart(str: string, chars: string = EMPTY): string {
    let size = str.length;

    if (chars === EMPTY) {
        for (let i = 0; i < str.length; i++) {
            if (Char.isWhiteSpaceAt(str, i)) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(size);
    }

    if (chars.length === 1) {
        const c = chars.charCodeAt(0);
        for (let i = 0; i < str.length; i++) {
            if (chars.charCodeAt(0) === c) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(size);
    }

    let j = 0;
    const codes = toCharCodeArray(chars);

    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) === codes[j]) {
            j++;
            if (j === chars.length) {
                j = 0;
                size = size - j;
            }

            continue;

        } else {
            break;
        }
    }

    if (size === str.length) {
        return str;
    }

    return str.substring(size);
}

export function trim(str: string, chars: string = EMPTY): string {
    return trimEnd(trimStart(str, chars), chars);
}

export function equalsIgnoreCase(left?: string | null, right?: string | null, locales?: string | string[]) {
    if (left === right) {
        return true;
    }

    if (left === undefined || right === undefined) {
        return false;
    }

    if (left === null || right === null) {
        return false;
    }

    return left.localeCompare(right, locales, { sensitivity: 'accent' }) === 0;
}

export function includesIgnoreCase(str: string, search: string, start = 0, locales?: string | string[]) {
    const searchLen = search.length;
    const strLen = str.length;
    let i = start;
    while (i <= strLen - searchLen) {
      let j = 0;
      while (j < searchLen && str[i + j].localeCompare(search[j], locales, { sensitivity: 'accent' }) === 0) {
        j++;
      }
      if (j === searchLen) {
        return true;
      }
      i++;
    }
    return false;
}

export function toCharacterArray(str: string): string[] {
    return str.split('');
}

export function toCharArray(str: string): Char[] {
    const set: Char[] = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code) {
            set.push(new Char(code));
        }
    }

    return set;
}

export function toCharCodeArray(str: string): number[] {
    const set: number[] = [];
    for (let i = 0; i < str.length; i++) {
        set.push(str.charCodeAt(i));
    }

    return set;
}

export function toCodePointArray(str: string): number[] {
    const set: number[] = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code) {
            set.push(code);
        }
    }

    return set;
}

export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
    if (str === null || str === undefined) {
        return true;
    }

    for (let i = 0; i < str.length; i++) {
        if (!Char.isWhiteSpaceAt(str, i)) {
            return false;
        }
    }

    return true;
}

export function isNullOrEmpty(str: string | null | undefined): boolean {
    if (str === null || str === undefined) {
        return true;
    }

    return str.length === 0;
}