import  { PwshModuleManager } from './tools/pwsh/mod.ts';

const mgr = new PwshModuleManager();
const out = await mgr.install("powershell-yaml", "0.4.6");

console.log(out.code);

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