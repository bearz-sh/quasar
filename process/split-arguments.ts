export function splitArguments(value: string): string[] {
    enum Quote {
        None = 0,
        Single = 1,
        Double = 2,
    }

    let token = '';
    let quote = Quote.None;
    const tokens = [];

    for (let i = 0; i < value.length; i++) {
        const c = value[i];

        if (quote > Quote.None) {
            if (quote === Quote.Single && c === '\'') {
                quote = Quote.None;
                tokens.push(token);
                token = '';
                continue;
            } else if (quote === Quote.Double && c === '"') {
                quote = Quote.None;
                tokens.push(token);
                token = '';
                continue;
            }

            token += c;
            continue;
        }

        if (c === ' ') {
            const remaining = (value.length - 1) - i;
            if (remaining > 2) {
                // if the line ends with characters that normally allow for scripts with multiline
                // statements, consume token and skip characters.
                // ' \\\n'
                // ' \\\r\n'
                // ' `\n'
                // ' `\r\n'
                const j = value[i + 1];
                const k = value[i + 2];
                if (j === '\'' || j === '`') {
                    if (k === '\n') {
                        i += 2;
                        if (token.length > 0) {
                            tokens.push(token);
                        }
                        token = '';
                        continue;
                    }

                    if (remaining > 3) {
                        const l = value[i + 3];
                        if (k === '\r' && l === '\n') {
                            i += 3;
                            if (token.length > 0) {
                                tokens.push(token);
                            }
                            token = '';
                            continue;
                        }
                    }
                }
            }

            if (token.length > 0) {
                tokens.push(token);
                token = '';
            }
            continue;
        }

        if (token.length === 0) {
            if (c === '\'') {
                quote = Quote.Single;
                continue;
            }
            if (c === '"') {
                quote = Quote.Double;
                continue;
            }
        }

        token += c;
    }

    if (token.length > 0) {
        tokens.push(token);
    }

    return tokens;
}