import { Registry } from "./registry.ts";
import { test } from '../../testing/mod.ts';
import { assert } from '../../assert/mod.ts';

test("registry", () => {
    const hkcu = Registry.hkcu;
    assert.exists(hkcu);
    const key = Registry.hkcu.openSubKey('Software\\Microsoft\\Windows\\CurrentVersion\\Run');
    assert.exists(key);
    assert.equals(key.name, 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run');

    Registry.close();
});


