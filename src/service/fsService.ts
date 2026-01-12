import fs from 'fs-extra'
import chalk from "chalk";

export function WriteFile(content : string , path : string){
    try {
        if(!fs.existsSync(path)) fs.ensureFileSync(path)
        fs.writeFileSync(path , content);
        console.log(chalk.gray.underline.italic(path));
    } catch (error : any) {
        console.log(chalk.redBright("🚫 Error while writing into destination file."))
        console.log(chalk.gray(error.message || error))
    }
}