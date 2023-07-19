// TODO: implement unicode tables / unicode categories

export enum UnicodeCategory {
    UppercaseLetter = 0,
    LowercaseLetter = 1,
    TitlecaseLetter = 2,
    ModifierLetter = 3,
    OtherLetter = 4,
    NonSpacingMark = 5,
    SpacingCombiningMark = 6,
    EnclosingMark = 7,
    DecimalDigitNumber = 8,
    LetterNumber = 9,
    OtherNumber = 10,
    SpaceSeparator = 11,
    LineSeparator = 12,
    ParagraphSeparator = 13,
    Control = 14,
    Format = 15,
    Surrogate = 16,
    PrivateUse = 17,
    ConnectorPunctuation = 18,
    DashPunctuation = 19,
    OpenPunctuation = 20,
    ClosePunctuation = 21,
    InitialQuotePunctuation = 22,
    FinalQuotePunctuation = 23,
    OtherPunctuation = 24,
    MathSymbol = 25,
    CurrencySymbol = 26,
    ModifierSymbol = 27,
    OtherSymbol = 28,
    OtherNotAssigned = 29,
}

// deno-fmt-ignore
const latin = [0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x8E, 0x8E, 0x8E, 0x8E, 0x0E, 0x0E, // U+0000..U+000F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0010..U+001F
0x8B, 0x18, 0x18, 0x18, 0x1A, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18, // U+0020..U+002F
0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18, // U+0030..U+003F
0x18, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, // U+0040..U+004F
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x14, 0x18, 0x15, 0x1B, 0x12, // U+0050..U+005F
0x1B, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, // U+0060..U+006F
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x14, 0x19, 0x15, 0x19, 0x0E, // U+0070..U+007F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0080..U+008F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0090..U+009F
0x8B, 0x18, 0x1A, 0x1A, 0x1A, 0x1A, 0x1C, 0x18, 0x1B, 0x1C, 0x04, 0x16, 0x19, 0x0F, 0x1C, 0x1B, // U+00A0..U+00AF
0x1C, 0x19, 0x0A, 0x0A, 0x1B, 0x21, 0x18, 0x18, 0x1B, 0x0A, 0x04, 0x17, 0x0A, 0x0A, 0x0A, 0x18, // U+00B0..U+00BF
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, // U+00C0..U+00CF
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x19, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x21, // U+00D0..U+00DF
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, // U+00E0..U+00EF
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x19, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,] // U+00F0..U+00FF]

const char: number = 'a'.codePointAt(0) as number;

const latinLowerMask = 0x20;
const latinUpperMask = 0x40;
const whitespaceFlag = 0x80;
const latinZero = 48;
const latinNine = 57;

const latinMax = 255;
const asciiMax = 127;

const IS_LETTER_EXP = new RegExp("\\p{L}", "u");
const IS_UPPER_EXP = new RegExp("\\p{Lu}", "u");
const IS_LOWER_EXP = new RegExp("\\p{Ll}", "u");

/**
 * Represents a unicode character (code point). NOTE:
 * most of the static methods only support Latin1.
 */
export class Char {
    public value: number;

    constructor(value: number) {
        if (!Number.isInteger(value)) {
            throw new Error(
                'Invalid character value, value must be an integer',
            );
        }
        this.value = value;
    }

    // deno-lint-ignore no-inferrable-types
    public static MaxValue: number = 0xffff;

    // deno-lint-ignore no-inferrable-types
    public static MinValue: number = 0;

    [Symbol.toPrimitive](hint: string) {
        switch (hint) {
            case 'string':
                return String.fromCharCode(this.value);
            case 'number':
                return this.value;

            case 'boolean':
                return this.value > Char.MinValue && this.value < Char.MaxValue;

            case 'bigint':
                return BigInt(this.value);

            default:
                return null;
        }
    }

    static isLatin1CharAt(value: string, index: number): boolean {
        return value.codePointAt(index) as number < latinMax;
    }

    static isLatin1CodePoint(value: number): boolean {
        return value < latinMax;
    }

    static isLatin1(value: Char): boolean {
        return value.value < latinMax;
    }

    static isAsciiCharAt(value: string, index: number): boolean {
        return value.codePointAt(index) as number < asciiMax;
    }

    static isAsciiCharCode(value: number): boolean {
        return value < asciiMax;
    }

    static isAsciiCodePoint(value: number): boolean {
        return value < asciiMax;
    }

    static isAscii(value: Char): boolean {
        return value.value < asciiMax;
    }

    static charAt(value: string, index: number): Char {
        return new Char(value.codePointAt(index) as number);
    }

    static isLowerAt(value: string, index: number): boolean {
        const code = value.charCodeAt(index);
        return (code & latinLowerMask) != 0;
    }

    static isLowerCharAt(value: string, index: number): boolean {
        const code = value.codePointAt(index) as number;
        if (this.isLatin1CodePoint(code)) {
            return (code & latinLowerMask) != 0;
        }

        return value[index].toLowerCase() === value[index];
    }

    static isLetterOrDigitCharAt(value: string, index: number): boolean {
        return Char.isLetterOrDigitCodePoint(
            value.codePointAt(index) as number,
        );
    }

    static isLetterOrDigitCodePoint(value: number): boolean {
        return isLetterCodePoint(value) ||
            Char.isDigitCodePoint(value);
    }

    static isLetterOrDigit(value: Char): boolean {
        return Char.isLetterOrDigitCodePoint(value.value);
    }

    static isLetterCharAt(value: string, index: number): boolean {
        return Char.isLetterCodePoint(value.codePointAt(index) as number);
    }

    static isLetterCharCode(value: number): boolean {
        if (value <= latinMax) {
            return (latin[value] & (latinUpperMask | latinLowerMask)) !== 0;
        }

        return IS_LETTER_EXP.test(String.fromCharCode(value));
    }

    static isLetterCodePoint(value: number): boolean {
        if (value <= latinMax) {
            // For the version of the Unicode standard the Char type is locked to, the
            // ASCII range doesn't include letters in categories other than "upper" and "lower".
            return (latin[value] & (latinUpperMask | latinLowerMask)) != 0;
        }

        return IS_LETTER_EXP.test(String.fromCodePoint(value));
    }

    static isLetter(value: Char): boolean {
        if (value.value <= latinMax) {
            // For the version of the Unicode standard the Char type is locked to, the
            // ASCII range doesn't include letters in categories other than "upper" and "lower".
            return (latin[value.value] & (latinUpperMask | latinLowerMask)) !=
                0;
        }

        return IS_LETTER_EXP.test(String.fromCodePoint(value.value));
    }

    static isBetweenCodePoint(value: number, start: number, end: number) {
        return value >= start && value <= end;
    }

    static isBetween(value: Char, start: Char, end: Char) {
        return value.value >= start.value && value.value <= end.value;
    }

    static isDigitCharAt(value: string, index: number): boolean {
        return this.isDigitCodePoint(value.codePointAt(index) as number);
    }

    static isDigitCodePoint(value: number): boolean {
        return value >= latinZero && value <= latinNine;
    }

    static isDigit(value: Char): boolean {
        return value.value > latinZero && value.value <= latinNine;
    }

    static isLowerCodePoint(value: number): boolean {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[char] as number;
            return (code & latinLowerMask) != 0;
        }

        return IS_LOWER_EXP.test(String.fromCodePoint(value));
    }

    static isLowerCharCode(value: number): boolean {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[value] as number;
            return (code & latinLowerMask) != 0;
        }
      
        return IS_LOWER_EXP.test(String.fromCodePoint(value));
    }

    static isLower(value: Char): boolean {
        const char = value.value;
        if (this.isLatin1(value)) {
            const code = latin[char] as number;
            return (code & latinLowerMask) != 0;
        }

        return String.fromCodePoint(char).toLowerCase() === value.toString();
    }

    static isUpperCharAt(value: string, index: number): boolean {
        return this.isUpperCodePoint(value.codePointAt(index) as number);
    }

    static isUpperCharCode(value: number): boolean {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[value] as number;
            return (code & latinUpperMask) != 0;
        }

        return IS_UPPER_EXP.test(String.fromCodePoint(value));
    }

    static toLowerCharAt(value: string, index: number): string {
        return value[index].toLowerCase();
    }

    static toLowerCharCode(value: number): number {
        return this.toLowerCodePoint(value);
    }

    static toLowerChar(value: Char): Char {
        return new Char(this.toLowerCharCode(value.value));
    }

    static toLowerCodePoint(value: number): number {
        if (value >= 65 && value <= 90) {
            return value + 32;
        }

        // already lower or non-letter
        if(value < 65 || (value >= 91 && value <= 191)) {
            return value;
        }

        return String.fromCharCode(value).toLowerCase().charCodeAt(0);
    }

    static toUpperCharAt(value: string, index: number): string {
        return value[index].toUpperCase();
    }

    static toUpperCharCode(value: number): number {
        return this.toUpperCodePoint(value);
    }

    static toUpperChar(value: Char): Char {
        return new Char(this.toUpperCharCode(value.value));
    }

    static toUpperCodePoint(value: number): number {
        if (value >= 97 && value <= 122) {
            return value - 32;
        }

        // already upper or non-letter
        if(value < 97 || (value >= 123 && value <= 191)) {
            return value;
        }

        return String.fromCharCode(value).toUpperCase().charCodeAt(0);
    }

    static isUpperCodePoint(value: number): boolean {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[value] as number;
            return (code & latinUpperMask) != 0;
        }

        if ((value >= 123 && value <= 191))
            return false;

        return IS_UPPER_EXP.test(String.fromCodePoint(value));
    }

    static isUpper(value: Char): boolean {
        return this.isUpperCodePoint(value.value);
    }

    static isWhiteSpaceAt(value: string, index: number): boolean {
        return (latin[value.codePointAt(index) as number] & whitespaceFlag) !=
            0;
    }

    static isWhiteSpaceCodePoint(value: number): boolean {
        return (latin[value] & whitespaceFlag) != 0;
    }

    static isWhiteSpace(value: Char): boolean {
        return (latin[value.value] & whitespaceFlag) != 0;
    }

    public valueOf() {
        this.value;
    }

    public toString() {
        return String.fromCharCode(this.value);
    }
}


export const {
    isAscii,
    isAsciiCharAt,
    isAsciiCharCode,
    isAsciiCodePoint,
    isWhiteSpace,
    isWhiteSpaceCodePoint,
    isWhiteSpaceAt,
    isUpper,
    isUpperCharAt,
    isUpperCharCode,
    isUpperCodePoint,
    isLower,
    isLowerCharAt,
    isLowerCharCode,
    isLowerCodePoint,
    isDigit,
    isDigitCharAt,
    isDigitCodePoint,
    isLetterOrDigit,
    isLetter,
    isLetterCharAt,
    isLetterCharCode,
    isLetterCodePoint,
} = Char;