import { task, shellTask, ps, runTaskRunner } from './tasks/mod.ts';


task("hello", async () => {
    await ps.run("echo", "Hello World");

});

shellTask("bash", "echo 'bash'");

shellTask("pwsh", "pwsh", "echo 'pwsh'");

task("skip_me", () => {
    console.log("before skip_me");
    return Promise.resolve();   
}).set({
    skip: true
})

task("default", ["hello", "skip_me", "pwsh", "bash"], () => {
    console.log("must run after hello");
    return Promise.resolve();
});



await runTaskRunner();

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