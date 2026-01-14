import chalk from "chalk";
import type { MappedFile } from "../adapters/adapter.interface.ts";
import fs from 'fs-extra'
import type { CLIContext } from "../cli/context.ts";
import RenderTemplate from "../service/templateRender.ts";
import { WriteFile } from "../service/fsService.ts";
export default async function Executor(
    plan : MappedFile[],
    context : CLIContext
) {
    try {
        
        if(!plan){
            console.log(chalk.red("🚫 Template and output path are not available !!!"));
            process.exit(0);
        }
        console.log(chalk.bold.whiteBright(`✅ File successfully created !!!`));
        for(const sPlan of plan){
            if(!fs.existsSync(sPlan.outputPath) || sPlan.overwrite){
                const content =fs.readFileSync(sPlan.templatePath).toString();
                WriteFile(content , sPlan.outputPath);
                continue;
            }
        }

    } catch (error : any) {
        console.log(chalk.red("❌ Executor stopped due to :: "))
        console.log(chalk.gray(error.message || error))
    }
}