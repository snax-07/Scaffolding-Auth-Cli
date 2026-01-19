import chalk from "chalk";
import { WriteFile } from "../service/fsService.ts";
import fs from 'fs-extra'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
type commanderOption =  {
    mod : string,
    lang ?: string
}

export function ADD(options : commanderOption){
 try {
    if(!options || !options.mod ){
        throw new Error("Arumnegts not provided , FallBack error !!!");
    };


const content = fs.readFileSync(path.join(path.resolve(__dirname , `../../src/template/module`) , `${options.lang || "ts"}` , `${options.mod}.${options.lang || "ts"}`)).toString();
const outputPath = path.join(process.cwd() , `automa.${options.lang || "ts"}`);    
// WriteFile(content , outputPath);
console.log(content)
console.log(chalk.greenBright(`✅ Module ${options.mod} added successfully at ${outputPath} !!!`));
    
 } catch (error : any) {
    console.log(chalk.redBright("💀 Error while adding module !!!"));
    console.log(chalk.gray("Error :: "  , error.message || error));
    process.exit(0);
 }   
}