// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

/** A library of assertion functions imported from deno std that remaps the names.
 * 
 * If the assertion is false an `AssertionError` will be thrown which will
 * result in pretty-printed diff of failing assertion.
 *
 * This module is browser compatible, but do not rely on good formatting of
 * values for AssertionError messages in browsers.
 *
 * @module
 */

import {
    assertEquals,
    assertStrictEquals,
    assertNotEquals,
    assertNotStrictEquals,
    assertMatch,
    assertNotMatch,
    assertArrayIncludes,
    assertThrows,
    assertRejects,
    assert as ok,
    AssertionError,
    assertExists,
    assertStringIncludes,
    assertAlmostEquals,
    assertFalse,
    assertInstanceOf,
    assertIsError,
    assertNotInstanceOf,
    assertObjectMatch,
    fail,
    unimplemented,
    unreachable

} from "https://deno.land/std@0.195.0/assert/mod.ts";

export { AssertionError }

// deno-lint-ignore no-explicit-any
type AnyConstructor = new (...args: any[]) => any;
type GetConstructorType<T extends AnyConstructor> = T extends // deno-lint-ignore no-explicit-any
new (...args: any) => infer C ? C
  : never;

export type Assertion = {
    equals<T>(actual: T, expected: unknown, msg?: string): void;
    exists<T>(actual: T, msg?: string): asserts actual is NonNullable<T>;
    strictEquals<T>(actual: T, expected: T, msg?: string): void;
    notEquals<T>(actual: T, expected: unknown, msg?: string): void;
    notStrictEquals<T>(actual: T, expected: T, msg?: string): void;
    match(actual: string, expected: RegExp, msg?: string): void;
    notMatch(actual: string, expected: RegExp, msg?: string): void;
    arrayIncludes<T>(
        actual: ArrayLike<T>,
        expected: ArrayLike<T>,
        msg?: string,
      ) : void;
      throws<E extends Error = Error>(
        fn: () => unknown,
        // deno-lint-ignore no-explicit-any
        ErrorClass: new (...args: any[]) => E,
        msgIncludes?: string,
        msg?: string,
      ): E;
      throws<E extends Error = Error>(
        fn: () => unknown,
        errorClassOrMsg?:
          // deno-lint-ignore no-explicit-any
          | (new (...args: any[]) => E)
          | string,
        msgIncludesOrMsg?: string,
        msg?: string,
      ): E | Error | unknown
    rejects<E extends Error = Error>(
        fn: () => PromiseLike<unknown>,
        // deno-lint-ignore no-explicit-any
        ErrorClass: new (...args: any[]) => E,
        msgIncludes?: string,
        msg?: string,
      ): Promise<E>;
    rejects<E extends Error = Error>(
        fn: () => PromiseLike<unknown>,
        errorClassOrMsg?:
          // deno-lint-ignore no-explicit-any
          | (new (...args: any[]) => E)
          | string,
        msgIncludesOrMsg?: string,
        msg?: string,
      ): Promise<E | Error | unknown>
    truthy(expr: unknown, msg?: string): asserts expr;
    ok(expr: unknown, msg?: string): asserts expr;
    almostEquals(actual: number, expected: number, delta?: number, msg?: string): void;
    falsey(expr: unknown, msg?: string): asserts expr;
    stringIncludes(actual: string, expected: string, msg?: string): void;
    instanceOf<T extends AnyConstructor>(
        actual: unknown,
        expectedType: T,
        msg?: string,
      ): asserts actual is GetConstructorType<T>
    isError<E extends Error = Error>(
        error: unknown,
        // deno-lint-ignore no-explicit-any
        ErrorClass?: new (...args: any[]) => E,
        msgIncludes?: string,
        msg?: string,
      ): asserts error is E
    notInstanceOf<A, T>(
        actual: A,
        // deno-lint-ignore no-explicit-any
        unexpectedType: new (...args: any[]) => T,
        msg?: string,
      ): asserts actual is Exclude<A, T>
    matchObject(actual: unknown, expected: unknown, msg?: string): void;
    fail(msg?: string): never;
    unimplemented(msg?: string): never;
    unreachable(): never;
}

export const assert : Assertion =  {
    equals: assertEquals,
    strictEquals: assertStrictEquals,
    notEquals: assertNotEquals,
    notStrictEquals: assertNotStrictEquals,
    match: assertMatch,
    notMatch: assertNotMatch,
    arrayIncludes: assertArrayIncludes,
    throws: assertThrows,
    rejects: assertRejects,
    ok: ok,
    truthy: ok,
    exists: assertExists,
    almostEquals: assertAlmostEquals,
    falsey: assertFalse,
    stringIncludes: assertStringIncludes,
    instanceOf: assertInstanceOf,
    isError: assertIsError,
    notInstanceOf: assertNotInstanceOf,
    matchObject: assertObjectMatch,
    fail: fail,
    unimplemented: unimplemented,
    unreachable: unreachable
}


export  {
    assertEquals as equals,
    assertStrictEquals as strictEquals,
    assertNotEquals as notEquals,
    assertNotStrictEquals as notStrictEquals,
    assertMatch as match,
    assertNotMatch as notMatch,
    assertArrayIncludes as arrayIncludes,
    assertThrows as throws,
    assertRejects as rejects,
    ok as truthy,
    assertAlmostEquals as almostEquals,
    assertFalse as falsey,
    assertExists as exists,
    assertStringIncludes as stringIncludes,
    assertInstanceOf as instanceOf,
    assertIsError as isError,
    assertNotInstanceOf as notInstanceOf,
    assertObjectMatch as matchObject,
    fail,
    unimplemented,
    unreachable
}