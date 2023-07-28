import { test } from "../testing/mod.ts";
import { assert } from "../assert/mod.ts";
import * as env from "./env.ts";
import { HOME_VAR_NAME, PATH_VAR_NAME } from "./constants.ts";
import { isEnvEnabled } from "../testing/deno_permissions.ts";

const hasEnv = await isEnvEnabled();

test.when(hasEnv, "env.get", () => {
    const path = env.get(PATH_VAR_NAME);
    const home = env.get(HOME_VAR_NAME);
    assert.exists(home);
    assert.exists(path);
});

test.when(hasEnv, "env.set", () => {
    const key = "TEST_ENV_KEY";
    const value = "TEST_ENV_VALUE";
    env.set(key, value);
    assert.equals(env.get(key), value);
});

test.when(hasEnv, "env.remove", () => {
    const key = "TEST_ENV_KEY";
    const value = "TEST_ENV_VALUE";
    env.set(key, value);
    assert.equals(env.get(key), value);
    assert.truthy(env.has(key));

    env.remove(key);
    assert.falsey(env.has(key));
});

test.when(hasEnv, "env.toObject", () => {
    const key = "TEST_ENV_KEY2";
    const value = "TEST_ENV_VALUE2";
    env.set(key, value);
    assert.equals(env.get(key), value);

    const obj = env.toObject();
    assert.exists(obj);
    assert.exists(obj[key]);
    assert.equals(obj[key], value);
});

test.when(hasEnv, "env.expand windows style var", () => {
    const home = HOME_VAR_NAME;
    const path = env.expand(`%${home}%`);
    assert.exists(path);
    assert.equals(path, env.get(home));

    const path2 = env.expand(`%${home}%\\test`);
    assert.exists(path2);
    assert.equals(path2, env.get(home) + "\\test");
});

test.when(hasEnv, "env.expand unix style var", () => {
    const home = HOME_VAR_NAME;

    const template1 = `$\{${home}\}`;
    const path = env.expand(template1);
    assert.exists(path);
    assert.equals(path, env.get(home));

    const path2 = env.expand(`$${home}/test`);
    assert.exists(path2);
    assert.equals(path2, env.get(home) + "/test");

    const defaulted = env.expand("${TEST_ENV_VAR:-default}");
    assert.exists(defaulted);
    assert.equals(defaulted, "default");

    let value = "";
    if (Deno.args.length > 0) {
        value = Deno.args[0];
    }

    const arg0 = env.expand("$0");
    assert.exists(arg0);
    assert.equals(arg0, value);
});
