import { scriptRunner as runner } from "../core/script_runner.ts";
import {} from "../bash/register_script_runner.ts";
import {} from "../sh/register_script_runner.ts";
import {} from "../pwsh/register_script_runner.ts";
import {} from "../powershell/register_script_runner.ts";
import {} from "../deno/register_script_runner.ts";
import {} from "../node/register_script_runner.ts";
export const scriptRunner = runner;
