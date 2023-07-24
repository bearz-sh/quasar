import { splat } from "../../mod.ts";
import {
    docker,
    network,
} from "./mod.ts";

import {
    ls
} from './network.ts'

await docker(["ps"]);

await network(splat({}, {
    command: ["ls"]
}));

await ls({});