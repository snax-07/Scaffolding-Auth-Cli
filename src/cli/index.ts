
import {Command} from 'commander'


function IntializeAutoma(){
    const program = new Command();

    program
    .name("automa")
    .description("Best auth scaffolding cli tool !!!")
    .version("1.0.1");

    program
    .command("demo")
    .action(() => {console.log("demo")})


    program.parse();
}


export default IntializeAutoma;