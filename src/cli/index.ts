
import {Command, Option} from 'commander'
import INIT from '../commands/init.ts';
import { ADD } from '../commands/add.ts';

function IntializeAutoma(){
    const program = new Command();

    program
    .name("automa")
    .description("Best auth scaffolding cli tool !!!")
    .version("1.0.1");

    program
    .command("init")
    .option("--lang <string>" , "This flag is used for setting the ext, otherwise it will crash your program !!!")
    .option("--framework <string>" , "This is used for the setting the framework by default uses the express")
    .option("--auth <string>" , "This flag used to store the auth type.")
    .option('--userModel <string>' , "This will define the model context or collection or table name.")
    .action(INIT)

    program
    .option("--help <string>" , "This command is mainly used for demostrating help towards the user !!!")
    .action((opt) => console.log(opt))

    program
    .command("add")
    .option("--mod <string>" , "This is used for adding the Specific module in the code and make sure that it is compatible !!!")
    .option("--lang <string>" , "This is used to define the prototype language code !!!")
    .action(ADD)

    program.parse();
}


export default IntializeAutoma;