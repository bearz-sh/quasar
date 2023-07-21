import { getLevelName } from "./levels.ts";

export interface LogRecordOptions {
    msg: string;
    args: unknown[];
    level: number;
    loggerName: string;
}
  
/**
 * An object that encapsulates provided message and arguments as well some
 * metadata that can be later used when formatting a message.
 */
export class LogRecord {
    readonly msg: string;
    #args: unknown[];
    #datetime: Date;
    readonly level: number;
    readonly levelName: string;
    readonly loggerName: string;
  
    constructor(options: LogRecordOptions) {
        this.msg = options.msg;
        this.#args = [...options.args];
        this.level = options.level;
        this.loggerName = options.loggerName;
        this.#datetime = new Date();
        this.levelName = getLevelName(options.level);
    }
    get args(): unknown[] {
        return [...this.#args];
    }
    get datetime(): Date {
        return new Date(this.#datetime.getTime());
    }
}