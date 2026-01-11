//THIS FILL TAKE INPUT FROM THE PLANNER AND GENERATE THE CONTENT FROMTEMPLATE FILE AND INTO OUTPUT FILE

import chalk from "chalk";
import type { MappedFile } from "../adapters/adapter.interface.ts";

export default function CodeGenerator(
    plan : MappedFile[]
){
    try {
        
    } catch (error) {
        console.log(chalk.redBright('💀 Error while generating the code !!!'));
        process.exit(0);
    }
}
