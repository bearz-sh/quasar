# Quasar

A portable automation Software Developer Kit ("SDK").

## Nonexhaustive list

- **collections** provides a case insenstive map.
- **errors** common errors that exend a `SystemError` that makes it eaiser to work with stack traces.
- **fs** file system functionality
- **path** handle dealing with file paths.
- **process** provides many functions to make it easier to execute child processes, capture output, determine if an
  executable is on the path, or convert an object to an executable's command line parameters.
- **os** a layer to deal with differences in operating systems and includes functions to work with environment variables
  and the env path variable.
- **secrets** provides a secret generator function and class and masking capabilities.
- **runtime** provides information about the current javascript runtime. e.g. deno, node, bun, etc
- **optional** provides result and option functions and classes.
- **fmt** provides support-colors from npm and a HostWriter class that can be swapped for differently implementations
  e.g. writing error, warnings in a continous integration pipeline like github or azure devops.
- **text** provides enhanced functions for dealing with characters or strings including things like case insenstive
  equals, trim, trimStart, trimEnd, indexOf and provides a string bulder class to hopefully reduce allocations.

## Why

Portability.

Most automation platforms such as cli task runners, ci/cd pipelines, make like tools and others write things in such a
way that it locks you in their ecosystem.

For example, if you want to use a docker task in github, azure devops, gulp, nuke.bulid, cake, etc, one generally uses
the built-in task for it.

That task doesn't work in other systems and many CI/CD systems do not even have a local runner. Some tasks such as using
choco to install software would be handy for CI/CD, setting up a developer machine or a remote virtual machine.

Quasar aims to provide the primitives around file system, path, environment variables, and executing processes to enable
developers to write portable code between ci/cd systems, operating systems, and other automation tooling.

It provides an altnerative to shell scripts.

The module is built in a way to abstract using the `Deno` object directly so that the code may be migrated to npm/node
or bun at a later date.

### Why Deno

Quasar is built on Deno because it is unique among scripting languages and runtimes. While Deno is marketed towards web
servers, servless, and edge computing; an overlooked use case is system scripting and automation.

Deno:

- Ships as a single executable and a full development suite of tools without the need for various different tools like
  webpack, eslint, etc.
- Allows es6 modules to just work from any website.
- Fast.
- Cross platform e.g. windows, linux, mac.
- Built in permissions for limiting things like file access.
- Support for Foreign Function Interfaces, so its possible to call native APIS like libc or Windows APIs.
- Removes some of the issues with python virtual environments or powershell sessions.
- It is trivial to install Deno on host machines.
- Allows the use of npm packages without npm. Though not all npm packages are currently supported.

## LICENSE

Everything is MIT unless otherwise noted.
