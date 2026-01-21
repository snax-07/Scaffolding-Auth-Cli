import chalk from "chalk";
import { WriteFile } from "../service/fsService.ts";
import fs from 'fs-extra'
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
type commanderOption =  {
    psrLang : string,
    msdLang : string,
    msdSender : string
}
export function ADD(options : commanderOption){
 try {
    if(!options){
        console.log(chalk.redBright("Arument expexcted but got 0."));
        process.exit(0);
    }

    if(options.psrLang){
        const spinner = ora("Adding Password Reset Module ...").start();
        const supportedLang : string[] = ['ts' , 'js'];
        if(!supportedLang.includes(options.psrLang)){
            spinner.fail(chalk.redBright("💀 Unsupported Language for Password Reset Module !!!"));
            process.exit(0);
        }
        const tmplatePah :string = path.join(__dirname , `../template/module/${options.psrLang}/passwordReset.${options.psrLang}`);
        const destPath : string= path.join(process.cwd() , `src/controllers/authController.${options.psrLang}`);
        if(!fs.existsSync(destPath)){
            spinner.fail(chalk.redBright("💀 authController file does not exists in your project !!!"));
            process.exit(0);
        }
        const data : string = fs.readFileSync(tmplatePah , {encoding : 'utf-8'})
                                .replace(/\/\*[\s\S]*?\*\//g, '')
                                .replace(/^\s*\/\/.*$/gm, '');
        fs.appendFileSync(destPath , `\n\n` + data);
        spinner.succeed(chalk.greenBright("✅ Password Reset Module Added Successfully !!!"));
    }else if(options.msdLang){
        const spinner = ora("Adding Multi Factor Module ...").start();
        const supportedLang : string[] = ['ts' , 'js'];
        let messageSenders : string = "";
        if(!supportedLang.includes(options.msdLang)){
            spinner.fail(chalk.redBright("💀 Unsupported Language for Multi Factor Module !!!"));
            process.exit(0);
        }
        if(options.msdSender && !["mail" , "sms"].includes(options.msdSender)){
            spinner.fail(chalk.redBright("💀 Unsupported Multi Factor Sender Type !!!"));
        }
        if(!options.msdSender){
            spinner.fail(chalk.redBright("💀 Multi Factor Sender Type is required !!!"));
            console.log(chalk.gray(" Using the default Message sender template !!!"));
            messageSenders = 'mail';
        }
        const templatePath : string  = path.join(__dirname , `../template/module/${options.msdLang}/${messageSenders}/${messageSenders}Sender.${options.msdLang}`);
        const destPath : string = path.join(process.cwd() , `src/utils/MessageSender.${options.msdLang}`);
        fs.ensureDirSync(path.join(process.cwd() , `src/utils/`));
        if(!fs.existsSync(destPath)){
            spinner.fail(chalk.redBright("💀 mailSender file does not exists in your project !!!"));
            console.log(chalk.gray("💀 Creating mailSender file in utils folder to use multi factor module !!!"));
            const data : string = fs.readFileSync(templatePath , {encoding : 'utf-8'})
                                    .replace(/\/\*[\s\S]*?\*\//g, '')
                                    .replace(/^\s*\/\/.*$/gm, '');
            fs.writeFileSync(destPath , data);
            spinner.succeed(chalk.greenBright("✅ mailSender file created successfully !!!"));
        }else{
            spinner.info(chalk.yellowBright("⚠ mailSender file already exists in your project !!!"));
            console.log(chalk.gray("💀 Skipping mailSender file creation ..."));
        }
        spinner.succeed(chalk.greenBright("✅ Multi Factor Module Added Successfully !!!"));        
    }
 } catch (error : any) {
    console.log(chalk.redBright("💀 Error while adding module !!!"));
    console.log(chalk.gray("Error :: "  , error.message || error));
    process.exit(0);
 }   
}