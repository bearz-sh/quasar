
import { ISecretMasker, secretMasker } from '../secrets/masker.ts';
import { stdout } from './_base.ts';
import { cyan } from 'https://deno.land/std@0.194.0/fmt/colors.ts';

export const writeCommandOptions = {
    enabled: true,
    masker: secretMasker as ISecretMasker,
};

export function writeCommand(fileName: string, args: string[]) {
    // write commands to the console to make it easier to follow along
    // with what is being executed
    if (!writeCommandOptions.enabled) {
        return;
    }

    const masker = writeCommandOptions.masker;
    let cmd = `${fileName} ${args.join(' ')}`;

    // mask any secrets written to the console
    cmd = masker.mask(cmd) as string;

    // TODO: write to stdout instead of console
    // @p42-ignore-next-line
    
    stdout.writeSync(new TextEncoder().encode(cyan(cmd) + '\n'));
}
