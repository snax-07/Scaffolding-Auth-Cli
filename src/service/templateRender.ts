import fs from 'fs-extra'
import chalk from "chalk";
import ejs from 'ejs'
import type { CLIContext } from '../cli/context.ts';


export default function RenderTemplate(path : string, context : CLIContext) : string{
    try {
        if(!path){
            console.log(chalk.red("💀 Internal config issue !!!"));
            process.exit(0);
        };

        const template = fs.readFileSync(path , "utf8");
        const renderedTemplate = ejs.render(template,{
            userModel : context.userModel,
            ext : context.lang
        });
        return renderedTemplate;
    } catch (error : any) {
        console.log(chalk.redBright("Error while renderring the content !!"))
        console.log(chalk.grey(error.message || error));
        process.exit(0);
    }
}