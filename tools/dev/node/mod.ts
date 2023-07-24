import { 
    IExecOptions, 
    IExecSyncOptions, 
    exec, 
    execSync, 
    generateScriptFile, 
    generateScriptFileSync, 
    registerExe,
    NotFoundOnPathError,
    cwd,
    join,
    IS_WINDOWS,
    exists,
    existsSync,
    rm,
    rmSync,
    isDirectory,
    isDirectorySync,
    which, 
    whichSync
} from "../../mod.ts";

registerExe("node", {
    windows: [
        "%ProgramFiles%\\nodejs\\node.exe"
    ]
});


registerExe("npm", {
    windows: [
        "%ProgramFiles%\\nodejs\\npm.cmd"
    ]
});

registerExe("yarn", {
    windows: [
        "%ProgramFiles(x86)%\\Yarn\\bin\\yarn.cmd"
    ]
});

export function node(args?: string[], options?: IExecOptions) {
    return exec("node", args, options);
}

node.cli = node;
node.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("node", args, options);
}

node.scriptFile = async function(scriptFile: string, options?: IExecOptions) {
    return await node.cli([scriptFile], options);
}

node.scriptFileSync = function(scriptFile: string, options?: IExecSyncOptions) {
    return node.sync([scriptFile], options);
}

node.script = async function(script: string, options?: IExecOptions) {
    const scriptFile = await generateScriptFile(script, ".js");
    try  {
        return await node.cli([scriptFile], options);
    } finally {
        if (await exists(scriptFile)) {
            await rm(scriptFile)
        }
    }
}

node.scriptSync = function(script: string, options?: IExecSyncOptions) {
    const scriptFile = generateScriptFileSync(script, ".js");
    try  {
        return node.sync([scriptFile], options);
    } finally {
        if (existsSync(scriptFile)) {
            rmSync(scriptFile)
        }
    }
}


export function npm(args?: string[], options?: IExecOptions) {
    return exec("npm", args, options);
}

npm.cli = npm;
npm.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("npm", args, options);
}

export function yarn(args?: string[], options?: IExecOptions) {
    return exec("yarn", args, options);
}

yarn.cli = yarn;
yarn.sync = function(args?: string[], options?: IExecSyncOptions) {
    return execSync("yarn", args, options);
}


export function findNpmBinFileSync(exe: string, workingDirectory?: string) : string | undefined {
    exe = IS_WINDOWS ? `${exe}.cmd` : exe;
    workingDirectory ||= cwd();
    
    const npmBin = join(workingDirectory, "node_modules", ".bin");

    if (isDirectorySync(npmBin))
    {
        const file = join(npmBin, exe);
        if (existsSync(file)) {
            return file;
        }
    }

    return whichSync(exe);
}

export async function findNpmBinFile(exe: string, workingDirectory?: string) : Promise<string | undefined> {
    exe = IS_WINDOWS ? `${exe}.cmd` : exe;
    workingDirectory ||= cwd();
    
    const npmBin = join(workingDirectory, "node_modules", ".bin");

    if (await isDirectory(npmBin)) {
        const file = join(npmBin, exe);
        if (await exists(file)) {
            return file;
        }
    }

    return await which(exe);
}

export async function tsc(args?: string[], options?: IExecOptions) {
    const cli = await findNpmBinFile('tsc');
    if (!cli) {
        throw new NotFoundOnPathError('tsc');
    }
    return exec(cli, args, options);
}

tsc.cli = tsc;
tsc.sync = function(args?: string[], options?: IExecSyncOptions) {
    const cli = findNpmBinFileSync('tsc');
    if (!cli) {
        throw new NotFoundOnPathError('tsc');
    }

    return execSync(cli, args, options);
}


export async function tsnode(args?: string[], options?: IExecOptions) {
    const cli = await findNpmBinFile('ts-node');
    if (!cli) {
        throw new NotFoundOnPathError('ts-node');
    }
    return exec(cli, args, options);
}

tsnode.cli = tsnode;
tsnode.sync = function(args?: string[], options?: IExecSyncOptions) {
    const cli = findNpmBinFileSync('ts-node');
    if (!cli) {
        throw new NotFoundOnPathError('ts-node');
    }
    
    return execSync(cli, args, options);
}

export function tsnodeSync(args?: string[], options?: IExecOptions) {
    const cli = findNpmBinFileSync('ts-node');
    if (!cli) {
        throw new NotFoundOnPathError('ts-node');
    }
    
    return execSync(cli, args, options);
}