import chalk from "chalk";
import type { MappedFile } from "../adapters/adapter.interface.ts";
import fs from 'fs-extra'
import type { CLIContext } from "../cli/context.ts";
import RenderTemplate from "../service/templateRender.ts";
import { WriteFile } from "../service/fsService.ts";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async function Executor(
    plan : MappedFile[],
    context : CLIContext
) {
    try {
        
        if(!plan){
            console.log(chalk.red("🚫 Template and output path are not available !!!"));
            process.exit(0);
        }
        if(context.authType === "session"){
            const content =fs.readFileSync(path.join(path.resolve(__dirname , `../../src/template`) , `${context.lang}/${context.authType}/${context.framework}` , `index.${context.lang}`)).toString();
            if(!fs.existsSync(path.join(context.projectRoot as string ,  "index.js"))){
                WriteFile(content , path.join(context.projectRoot as string ,  "index.js"));
            }else{
                fs.appendFileSync(path.join(context.projectRoot as string , "src" , "index.js") , content);
            }
        }
        console.log(chalk.bold.whiteBright(`✅ Files successfully created !!!`));
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