export * from "../assert/mod.ts";
export * from "./deno_permissions.ts";

export interface ITestContext {
    name: string;
    origin: string;
    parent?: ITestContext;

    step(definition: IStepDefinition): Promise<boolean>;
    step(name: string, fn: (t: ITestContext) => void | Promise<void>): Promise<boolean>;
    step(fn: (t: ITestContext) => void | Promise<void>): void | Promise<boolean>;
}

export interface IStepDefinition {
    name: string;
    fn: (t: ITestContext) => void | Promise<void>;
    ignored?: boolean;
    sanitizeExit?: boolean;
    sanitizeOps?: boolean;
    sanitizeResources?: boolean;
}

export interface ITestDefinition extends IStepDefinition {
    permissions?: Deno.PermissionOptions;
}

export function test(
    name: string,
    options: Omit<ITestDefinition, "name" | "fn">,
    fn: (t: ITestDefinition) => void,
): void;
export function test(name: string, fn: (t: ITestContext) => void | Promise<void>): void;
export function test(t: ITestDefinition): void;
export function test() {
    const first = arguments[0];

    if (typeof first === "string") {
        switch (arguments.length) {
            case 2:
                Deno.test(arguments[0], arguments[1] as (t: Deno.TestContext) => void | Promise<void>);
                return;

            case 3:
                Deno.test(arguments[0], arguments[1] as Omit<ITestDefinition, "name" | "fn">, arguments[2]);
                return;

            default:
                throw new Error("Invalid number of arguments");
        }
    }

    if (typeof arguments[0] === "object") {
        Deno.test(arguments[0]);
        return;
    }

    throw new Error("Invalid arguments");
}

function when(
    condition: boolean,
    name: string,
    options: Omit<ITestDefinition, "name" | "fn" | "ignore">,
    fn: (t: ITestContext) => void | Promise<void>,
): void;
function when(condition: boolean, name: string, fn: (t: ITestContext) => void | Promise<void>): void;
function when() {
    switch (arguments.length) {
        case 3:
            Deno.test(arguments[1], { ignore: !arguments[0] }, arguments[2]);
            return;

        case 4: {
            const o = arguments[2] as Omit<ITestDefinition, "name" | "fn" | "ignore">;
            Deno.test(arguments[1], { ignore: !arguments[0], ...o }, arguments[3]);
            return;
        }

        default:
            throw new Error("Invalid number of arguments");
    }
}

test.when = when;
