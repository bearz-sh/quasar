# CLAs

The Command Line Apps module provides APIs for calling common command line apps and utilities.

Each module registers well known install locations for the case of the application being recently installed and its not
available on the path or the environment path has been mangled.

It also registers an environment variable name that allows changing the path of the executable to use, which is useful
for switching between versions of an executable.
