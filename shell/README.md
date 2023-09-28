# Shell

Shell is a namespace for various cli wrappers for command line applications to call from deno.

The core folder contains shared code and the script_runner folder contains the script_runner object which some initial
register scripts that are invoke to allow calling pwsh, bash, sh, and powershell scripts with the script runner.

Examples for script_runner can be found in the [tests](./script_runner/mod_test.ts) file.

Functionality may be added over time to deal with package management and provide more idomatic apis to make it easier to
call the command line applications from deno scripts.
