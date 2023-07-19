

const getRandomValues = crypto.getRandomValues;
const randomUUID = crypto.randomUUID;

const randomBytes = (length: number): Uint8Array => {
    const buffer = new Uint8Array(length);
    getRandomValues(buffer);
    return buffer;
};

const codes: number[] = [];
const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

for (let i = 0; i < validChars.length; i++) {
    codes.push(validChars.codePointAt(i)!);
}

function randomFileName(length = 12, characters?: string) {
    // useful for generating as password that can be cleared from memory
    // as strings are immutable in javascript
    const chars: Uint8Array = new Uint8Array(length);

    const codePoints = codes;
    if(characters && characters.length > 1) {
        for (let i = 0; i < characters.length; i++) {
            codePoints.push(characters.codePointAt(i)!);
        }
    }

    chars.fill(0);
    const bytes = randomBytes(12);

    for (let i = 0; i < length; i++) {
        const bit = (Math.abs(bytes[i]) % codePoints.length);
        chars[i] = codePoints[bit];
    }

    return String.fromCodePoint(...chars);
}

export { getRandomValues, randomBytes, randomFileName, randomUUID };