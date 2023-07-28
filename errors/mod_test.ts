import { assert, test } from "../testing/mod.ts";
import { NotFoundOnPathError, ProcessError } from "./mod.ts";

test("NotFoundOnPathError", () => {
    assert.throws<NotFoundOnPathError>(
        () => {
            throw new NotFoundOnPathError("test");
        },
        NotFoundOnPathError,
        `Executable test not found on PATH.`,
    );
});

test("ProcessError", () => {
    assert.throws<ProcessError>(
        () => {
            throw new ProcessError("test", 1);
        },
        ProcessError,
        `An error with a child process test occurred. exitCode: 1`,
    );
});
