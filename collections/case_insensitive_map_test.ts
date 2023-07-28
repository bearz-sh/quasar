import { assert, test } from "../testing/mod.ts";
import { CaseInsensitiveMap } from "./case_insensitive_map.ts";

test("CaseInsensitiveMap", () => {
    const map = new CaseInsensitiveMap<string>();
    map.set("abbra", "a");
    map.set("babs", "b");
    map.set("cats", "c");

    assert.equals(map.get("abbra"), "a");
    assert.equals(map.get("ABBra"), "a");
    assert.equals(map.get("nothing"), undefined);
    assert.equals(map.get("BABS"), "b");
    assert.equals(map.get("Cats"), "c");
    assert.truthy(map.has("abbra"));
    assert.truthy(map.has("ABBra"));
    assert.falsey(map.has("nothing"));
    assert.truthy(map.has("BABS"));
    assert.truthy(map.has("Cats"));
    assert.equals(map.size, 3);

    map.delete("ABBRA");
    assert.equals(map.size, 2);
    assert.falsey(map.has("abbra"));
    assert.falsey(map.has("ABBra"));

    map.delete("babs");
    assert.equals(map.size, 1);
});
