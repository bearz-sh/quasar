import { ChocoManager } from './tools/choco/mod.ts';
import { whichSync } from './process/which.ts';

console.log(whichSync("choco"));

const choco = new ChocoManager();
console.log(await choco.list(""));





/*
import { bash } from './tools/bash/mod.ts';
import  { npm } from './tools/node/mod.ts';
import { echo } from './tools/utils/echo.ts';
import { tee } from './tools/utils/tee.ts';

await echo(["Hello World"], { stdout: 'piped' })
    .then(p => p.pipe(tee, ["-a", "./test.txt"]));

await npm(["--help"]);

await bash.script('echo "Hello World $PWD $FOO"', { cwd: "C:\\ProgramData", env: { "FOO": "BAR" } });
*/