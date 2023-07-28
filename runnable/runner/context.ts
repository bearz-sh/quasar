
import * as path from "../../path/mod.ts";
import * as fs from '../../fs/mod.ts';
import { 
    IExecutionContext, 
    IFileSystem, 
    IPath, 
    IEnv, 
    IOperatingSystem,
    IProcess 
} from "../interfaces.ts";
import { 
    Env,
    ps,
    os,
    secrets,
    CaseInsensitiveMap 

} from './services.ts'


export class ExecutionContext implements IExecutionContext
{
    readonly env: IEnv;
    readonly path: IPath;
    readonly fs: IFileSystem;
    readonly secrets: Map<string, string>;
    readonly outputs: Map<string, unknown>;
    signal?: AbortSignal;
    readonly os: IOperatingSystem;
    readonly ps: IProcess;

    constructor(context?: ExecutionContext)
    {
        if (context) {
            const ctx = context;
            this.env = ctx.env;
            this.path = ctx.path;
            this.fs = ctx.fs;
            this.secrets = ctx.secrets;
            this.outputs = ctx.outputs;
            this.os = ctx.os;
            this.ps = ctx.ps;
            return;
        }

        this.env = new Env();
        this.path = path;
        this.fs = fs;
        this.secrets= secrets;
        this.outputs = new CaseInsensitiveMap<string>();
        this.os = os;
        this.ps = ps;
    }
}