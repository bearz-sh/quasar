import { IS_WINDOWS } from "../mod.ts";
import { Result, err, ok } from "../optional/result.ts";
import { ProcessError } from "../process/errors.ts";
import { scriptRunner } from "../tools/script-runner.ts";
import { ITask, ITaskBuilder, ITaskExecutionContext, ITaskResult } from "./interfaces.ts";
import { TaskCollection } from "./task_collecton.ts";

const Tasks = new TaskCollection();
export function shellTask(id: string, shell: string, script: string): Omit<ITaskBuilder, 'run'>;
export function shellTask(id: string, script: string): Omit<ITaskBuilder, 'run'>;
export function shellTask() : Omit<ITaskBuilder, 'run'> {

    const id = arguments[0] as string;
    let shell = IS_WINDOWS ? 'powershell' : 'bash';
    let script = "";
    switch(arguments.length)
    {
        case 2:
            script = arguments[1] as string;
        break;
        case 3:
            shell = arguments[1] as string;
            script = arguments[2] as string;
            break;

        default:
            throw new Error("Invalid arguments");
    }

    const wrap = async function(ctx: ITaskExecutionContext) : Promise<Result<ITaskResult, Error>> {
        try {
           
            const out = await scriptRunner.run(shell, script, {
                cwd: ctx.cwd,
            });
            if (out.code !== 0) {
                return err(new ProcessError(shell, out.code));
            }

            return ok({ status: 'ok' } as unknown as ITaskResult);
        } catch (e) {
            if (e instanceof Error)
                return err(e);

            return err(new Error(String(e)));
        }
    }

    const task : ITask = {
        id,
        name: id,
        description: undefined,
        run: wrap
    }

    return Tasks.add(task);
}

export function task(
    id: string, 
    action: (ctx: ITaskExecutionContext) => Promise<Result<ITaskResult, Error>> | Promise<void>): 
    Omit<ITaskBuilder, 'run'> {
    
    const wrap = async (ctx: ITaskExecutionContext) : Promise<Result<ITaskResult, Error>> => {
        try {
            const result = await action(ctx);
            if (result === undefined) {
                return ok({ status: 'ok' } as unknown as ITaskResult);
            }

            return result;
        } catch (e) {
            if (e instanceof Error)
                return err(e);

            return err(new Error(String(e)));
        }
    }

    const task : ITask = {
        id,
        name: id,
        description: undefined,
        timeout: undefined,
        inputs: undefined,
        workingDirectory: undefined,
        run: wrap
    }


    return Tasks.add(task);
}