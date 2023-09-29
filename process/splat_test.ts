import { assert, test } from "../testing/mod.ts";
import { splat } from "./splat.ts";

test({
    name: "splat",
    fn() {
        const args = splat({
            foo: "bar",
            baz: "qux",
            quux: "corge",
        });

        assert.truthy(args.length === 6);
        assert.equals(args[0], "--foo");
        assert.equals(args[1], "bar");
        assert.equals(args[2], "--baz");
        assert.equals(args[3], "qux");
        assert.equals(args[4], "--quux");
        assert.equals(args[5], "corge");
    },
});

test({
    name: "splat with prefix",
    fn() {
        const args = splat(
            {
                foo: "bar",
                baz: "qux",
                quux: "corge",
            },
            { prefix: "-" },
        );

        assert.truthy(args.length === 6);
        assert.equals(args[0], "-foo");
        assert.equals(args[1], "bar");
        assert.equals(args[2], "-baz");
        assert.equals(args[3], "qux");
        assert.equals(args[4], "-quux");
        assert.equals(args[5], "corge");
    },
});

test({
    name: "splat with assign",
    fn() {
        const args = splat(
            {
                foo: "bar",
                baz: "qux",
                quux: "corge",
            },
            { assign: "=" },
        );

        assert.truthy(args.length === 3);
        assert.equals(args[0], "--foo=bar");
        assert.equals(args[1], "--baz=qux");
        assert.equals(args[2], "--quux=corge");
    },
});

test({
    name: "splat with short flag",
    fn() {
        const args = splat(
            {
                foo: "bar",
                baz: "qux",
                quux: "corge",
            },
            { shortFlag: false },
        );

        assert.truthy(args.length === 6);
        assert.equals(args[0], "--foo");
        assert.equals(args[1], "bar");
        assert.equals(args[2], "--baz");
        assert.equals(args[3], "qux");
        assert.equals(args[4], "--quux");
        assert.equals(args[5], "corge");
    },
});

test({
    name: "splat with aliases",
    fn() {
        const args = splat(
            {
                foo: "bar",
                baz: "qux",
                quux: "corge",
            },
            { aliases: { foo: "-f", baz: "-b", quux: "--quu" } },
        );

        assert.truthy(args.length === 6);
        assert.equals(args[0], "-f");
        assert.equals(args[1], "bar");
        assert.equals(args[2], "-b");
        assert.equals(args[3], "qux");
        assert.equals(args[4], "--quu");
        assert.equals(args[5], "corge");
    },
});

test({
    name: "splat with includes",
    fn() {
        const args = splat(
            {
                foo: "bar",
                baz: "qux",
                quux: "corge",
                grault: "garply",
            },
            { includes: ["foo", "baz"] },
        );

        assert.truthy(args.length === 4);
        assert.equals(args[0], "--foo");
        assert.equals(args[1], "bar");
        assert.equals(args[2], "--baz");
        assert.equals(args[3], "qux");
    },
});

test({
    name: "splat with ignoreTrue",
    fn() {
        const args = splat(
            {
                foo: true,
                baz: "qux",
                quux: "corge",
            },
            { ignoreTrue: true },
        );

        assert.truthy(args.length === 4);
        assert.equals(args[0], "--baz");
        assert.equals(args[1], "qux");
        assert.equals(args[2], "--quux");
        assert.equals(args[3], "corge");
    },
});

test({
    name: "splat with ignoreFalse",
    fn() {
        const args = splat(
            {
                foo: false,
                baz: "qux",
                quux: "corge",
            },
            { ignoreFalse: true },
        );

        assert.truthy(args.length === 4);
        assert.equals(args[0], "--baz");
        assert.equals(args[1], "qux");
        assert.equals(args[2], "--quux");
        assert.equals(args[3], "corge");
    },
});

test({
    name: "splat with no args",
    fn() {
        const args = splat({});

        assert.truthy(args.length === 0);
    },
});

test({
    name: "splat with no args and prefix",
    fn() {
        const args = splat({}, { prefix: "-" });

        assert.truthy(args.length === 0);
    },
});

test({
    name: "splat with command",
    fn() {
        const args = splat({
            foo: "bar",
        }, { command: ["cmd"] });

        console.log(args);
        assert.equals(args.length, 3);
        assert.equals(args[0], "cmd");
        assert.equals(args[1], "--foo");
        assert.equals(args[2], "bar");
    },
});

test({
    name: "splat with arguments",
    fn() {
        const args = splat({
            arg: "bar",
        }, { arguments: ["arg"] });

        assert.equals(args.length, 1);
        assert.equals(args[0], "bar");

        const args2 = splat({
            arg: "basil",
            foo: "bar",
        }, { arguments: ["arg", "arg2"] });

        console.log(args2, "args2");

        assert.equals(args2.length, 3);
        assert.equals(args2[0], "basil");
        assert.equals(args2[1], "--foo");
        assert.equals(args2[2], "bar");

        const args3 = splat({
            arg: "basil",
            arg3: null,
            arg2: "snail",
            foo: "bar",
        }, { arguments: ["arg", "arg2", "arg3"] });

        console.log(args3, "args3");

        assert.equals(args3.length, 4);
        assert.equals(args3[0], "basil");
        assert.equals(args3[1], "snail");
        assert.equals(args3[2], "--foo");
        assert.equals(args3[3], "bar");
    },
});

test({
    name: "splat with command and arguments",
    fn() {
        const args = splat({
            arg: "deno",
            foo: "bar",
        }, { command: ["cmd"], arguments: ["arg"] });

        assert.equals(args.length, 4);
        assert.equals(args[0], "cmd");
        assert.equals(args[1], "deno");
        assert.equals(args[2], "--foo");
        assert.equals(args[3], "bar");

        const args2 = splat({
            arg: "deno",
            foo: "bar 2",
        }, { command: ["cmd"], arguments: ["arg"], assign: "=" });

        assert.equals(args2.length, 3);
        assert.equals(args2[0], "cmd");
        assert.equals(args2[1], "deno");
        assert.equals(args2[2], "--foo=bar 2");
    },
});

test({
    name: "splat with command and arguments and prefix",
    fn() {
        const args = splat({
            arg: "deno",
            foo: "bar",
        }, { command: ["cmd"], arguments: ["arg"], prefix: "/" });

        assert.equals(args.length, 4);
        assert.equals(args[0], "cmd");
        assert.equals(args[1], "deno");
        assert.equals(args[2], "/foo");
        assert.equals(args[3], "bar");
    },
});

test({
    name: "splat with preserve case",
    fn() {
        const args = splat({
            Source: "deno",
            foo: "bar",
            NuGet: "baz",
        }, { preserveCase: true, prefix: "-" });

        assert.equals(args.length, 6);
        assert.equals(args[0], "-Source");
        assert.equals(args[1], "deno");
        assert.equals(args[2], "-foo");
        assert.equals(args[3], "bar");
        assert.equals(args[4], "-NuGet");
        assert.equals(args[5], "baz");
    },
});
