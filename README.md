# Quasar

A portable automation Software Developer Kit ("SDK").

## Why

Portability.

Most automation platforms such as cli task runners, ci/cd pipelines,
make like tools and others write things in such a way that it locks you
in their ecosystem.

For example, if you want to use a docker task in github, azure devops,
gulp, nuke.bulid, cake, etc, one generally uses the built-in task for it.

That task doesn't work in other systems and many CI/CD systems do not even
have a local runner.  Some tasks such as using choco to install software
would be handy for CI/CD, setting up a developer machine or a remote virtual machine.

Quasar aims to provide the primitives around file system, path, environment
variables, and executing processes to enable developers to write portable code
between ci/cd systems, operating systems, and other automation tooling.  

It provides an altnerative to shell scripts

## Why Deno

Quasar is built on Deno because it is unique among scripting languages and runtimes. While
Deno is marketed towards web servers, servless, and edge computing; an overlooked use case
is system scripting and automation.

Deno:

- Ships as a single executable and a full development suite of tools without
  the need for various different tools like webpack, eslint, etc.
- Allows es6 modules to just work from any website.
- Fast.
- Cross platform e.g. windows, linux, mac.
- Built in permissions for limiting things like file access.
- Support for Foreign Function Interfaces, so its possible
  to call native APIS like libc or Windows APIs.
- Removes some of the issues with python virtual environments or
  powershell sessions.
- It is trivial to install Deno on host machines.
- Allows the use of npm packages without npm. Though not all npm packages
  are currently supported.
