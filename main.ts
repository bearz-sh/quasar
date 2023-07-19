import { bashScript } from './tools/bash/mod.ts';
import  { node } from './tools/node/mod.ts';
import { echo } from './tools/utils/echo.ts';
import { tee } from './tools/utils/tee.ts';

await echo(["Hello World"], { stdout: 'piped' })
    .then(p => p.pipe(tee, ["-a", "./test.txt"]));

await node(['-v']);

await bashScript('echo "Hello World $PWD $FOO"', { cwd: "C:\\ProgramData", env: { "FOO": "BAR" } });