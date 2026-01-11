
import {Command, Option} from 'commander'
import INIT from '../commands/init.ts';


function IntializeAutoma(){
    const program = new Command();

    program
    .name("automa")
    .description("Best auth scaffolding cli tool !!!")
    .version("1.0.1");

    program
    .command("demo")
    .option("--lang <string>" , "This flag is used for setting the ext, otherwise it will crash your program !!!")
    .option("--framework <string>" , "This is used for the setting the framework by default uses the express")
    .option("--auth <string>" , "This flag used to store the auth type.")
    .option('--userModel <string>' , "This will define the model context or collection or table name.")
    .action(INIT)


    program.parse();
}


export default IntializeAutoma;