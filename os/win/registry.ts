import { Ptr } from "./native/core.ts";
import { close, closeKey, openKey2 } from "./native/registry.ts";

export enum RegistryHive {
    ClassesRoot = 0x80000000,
    CurrentUser = 0x80000001,
    LocalMachine = 0x80000002,
    Users = 0x80000003,
    PerformanceData = 0x80000004,
    CurrentConfig = 0x80000005,
}

export enum RegistryView {
    Default = 0x00000000,
    Registry64 = 0x00000100,
    Registry32 = 0x00000200,
}

export enum RegistryKeyPermissionCheck {
    Default = 0,
    ReadSubTree = 1,
    ReadWriteSubTree = 2,
}

const KEY_QUERY_VALUE = 0x0001;
const KEY_SET_VALUE = 0x0002;
const KEY_CREATE_SUB_KEY = 0x0004;
const KEY_ENUMERATE_SUB_KEYS = 0x0008;
const KEY_NOTIFY = 0x0010;
const KEY_CREATE_LINK = 0x0020;
const READ_CONTROL = 0x00020000;
const SYNCHRONIZE = 0x00100000;
const KEY_READ = (READ_CONTROL | KEY_QUERY_VALUE |
    KEY_ENUMERATE_SUB_KEYS |
    KEY_NOTIFY) &
    (~SYNCHRONIZE);

const KEY_WRITE = (READ_CONTROL | KEY_SET_VALUE | KEY_CREATE_SUB_KEY) & (~SYNCHRONIZE);

export enum RegistryRights {
    QueryValues = KEY_QUERY_VALUE,
    SetValue = KEY_SET_VALUE,
    CreateSubKey = KEY_CREATE_SUB_KEY,
    EnumerateSubKeys = KEY_ENUMERATE_SUB_KEYS,
    Notify = KEY_NOTIFY,
    CreateLink = KEY_CREATE_LINK,

    ReadKey = (READ_CONTROL | KEY_QUERY_VALUE | KEY_ENUMERATE_SUB_KEYS | KEY_NOTIFY),
    WriteKey = (READ_CONTROL | KEY_SET_VALUE | KEY_CREATE_SUB_KEY),
    ExecuteKey = (READ_CONTROL | KEY_QUERY_VALUE | KEY_ENUMERATE_SUB_KEYS | KEY_NOTIFY),
    ReadPermissions = 0x20000,
    ChangePermissions = 0x40000,
    TakeOwnership = 0x80000,
    FullControl = (0xF003F | READ_CONTROL | READ_CONTROL),
}

function getRegistryKeyAccess(mode: RegistryKeyPermissionCheck) {
    switch (mode) {
        case RegistryKeyPermissionCheck.Default:
            return KEY_READ;

        case RegistryKeyPermissionCheck.ReadSubTree:
            return KEY_READ;

        case RegistryKeyPermissionCheck.ReadWriteSubTree:
            return KEY_READ | KEY_WRITE;

        default:
            return 0;
    }
}

class RegistryKey {
    #hkey: Ptr;
    #keyName: string;
    #checkMode: RegistryKeyPermissionCheck;
    #writable: boolean;
    #systemkey: boolean;
    #remoteKey: boolean;
    #isPerfData: boolean;
    #view: RegistryView;
    #disposed: boolean;

    constructor(
        hkey: Ptr,
        keyName = "",
        writable: boolean,
        systemkey = false,
        remoteKey = false,
        isPerfData = false,
        view = RegistryView.Default,
    ) {
        this.#disposed = false;
        this.#hkey = hkey;
        this.#keyName = keyName;
        this.#writable = writable;
        this.#systemkey = systemkey;
        this.#remoteKey = remoteKey;
        this.#isPerfData = isPerfData;
        this.#view = view;
        this.#checkMode = RegistryKeyPermissionCheck.Default;
    }

    get disposed(): boolean {
        return this.#disposed;
    }

    get name(): string {
        return this.#keyName;
    }

    dispose() {
        if (this.disposed) {
            return;
        }

        if (this.#hkey !== undefined) {
            closeKey(this.#hkey);
        }
    }

    openSubKey(
        name: string,
        permissionCheck?: RegistryKeyPermissionCheck,
        rights?: RegistryRights,
    ): RegistryKey | null {
        const out = new Ptr();
        permissionCheck = permissionCheck ?? this.#writable
            ? RegistryKeyPermissionCheck.ReadWriteSubTree
            : RegistryKeyPermissionCheck.ReadSubTree;
        rights = rights ?? getRegistryKeyAccess(permissionCheck);

        const result = openKey2(this.#hkey, name, 0, RegistryRights.ReadKey, out);

        console.debug(
            "RegOpenKeyExW",
            this.#keyName,
            name,
            Deno.UnsafePointer.value(this.#hkey.value),
            result,
            0,
            RegistryRights.FullControl,
            out.value,
        );
        if (result === 0) {
            const v = Deno.UnsafePointer.value(out.value);
            if (v !== 0) {
                const keyName = this.#keyName + "\\" + name;
                const writable = permissionCheck === RegistryKeyPermissionCheck.ReadWriteSubTree;
                return new RegistryKey(out, keyName, writable, false, this.#remoteKey, false, this.#view);
            }
        }

        if (result === 0x57) {
            throw new Error("Invalid parameter");
        }

        if (result === 0x5 || result === 0x542) {
            throw new Error("Access denied");
        }

        return null;
    }
}

function openBaseKey(hKey: RegistryHive, view: RegistryView): RegistryKey {
    if (view === RegistryView.Registry64) {
        throw new Error("Registry64 is not supported");
    }

    if (view === RegistryView.Registry32) {
        throw new Error("Registry32 is not supported");
    }

    const isPerfData = hKey === RegistryHive.PerformanceData;
    let keyName = "";
    switch (hKey) {
        case RegistryHive.ClassesRoot:
            keyName = "HKEY_CLASSES_ROOT";
            break;
        case RegistryHive.CurrentUser:
            keyName = "HKEY_CURRENT_USER";
            break;

        case RegistryHive.LocalMachine:
            keyName = "HKEY_LOCAL_MACHINE";
            break;

        case RegistryHive.Users:
            keyName = "HKEY_USERS";
            break;

        case RegistryHive.PerformanceData:
            keyName = "HKEY_PERFORMANCE_DATA";
            break;

        case RegistryHive.CurrentConfig:
            keyName = "HKEY_CURRENT_CONFIG";
            break;

        default:
            keyName = "Unknown";
            break;
    }

    const nkey = new Ptr(hKey);
    return new RegistryKey(nkey, keyName, true, true, false, isPerfData, view);
}

interface IRegistryKeyCache {
    hkcr?: RegistryKey;
    hklm?: RegistryKey;
    hkcu?: RegistryKey;
    hku?: RegistryKey;
    hkpd?: RegistryKey;
    hkcc?: RegistryKey;
}

const keyCache: IRegistryKeyCache = {};

export class Registry {
    static get hkcr(): RegistryKey {
        if (keyCache.hkcr === undefined) {
            keyCache.hkcr = openBaseKey(RegistryHive.ClassesRoot, RegistryView.Default);
        }

        return keyCache.hkcr;
    }

    static get hklm(): RegistryKey {
        if (keyCache.hklm === undefined) {
            keyCache.hklm = openBaseKey(RegistryHive.LocalMachine, RegistryView.Default);
        }

        return keyCache.hklm;
    }

    static get hkcu(): RegistryKey {
        if (keyCache.hkcu === undefined) {
            keyCache.hkcu = openBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
        }

        return keyCache.hkcu;
    }

    static get hku(): RegistryKey {
        if (keyCache.hku === undefined) {
            keyCache.hku = openBaseKey(RegistryHive.Users, RegistryView.Default);
        }

        return keyCache.hku;
    }

    static get hkpd(): RegistryKey {
        if (keyCache.hkpd === undefined) {
            keyCache.hkpd = openBaseKey(RegistryHive.PerformanceData, RegistryView.Default);
        }

        return keyCache.hkpd;
    }

    static get hkcc(): RegistryKey {
        if (keyCache.hkcc === undefined) {
            keyCache.hkcc = openBaseKey(RegistryHive.CurrentConfig, RegistryView.Default);
        }

        return keyCache.hkcc;
    }

    static close() {
        close();
    }
}
