import chalk from "chalk";
import type { Adapter } from "../adapters/adapter.interface.ts";
import { ExpressAdapter } from "../adapters/express/express-adapter.ts";


export interface CLIContext {
  framework?: string;        // detected framework name
  lang?: "ts" | "js";    // user selected language
  adapter?: Adapter;         // selected adapter instance
  authType?: string;         // user selected auth type
  projectRoot?: string;      // root folder
  userModel?: string;        // define context model will used in operation
}
export type AdapterConstructor = new () => Adapter;

const adapterRegistry: Record<string, AdapterConstructor> = {
  express: ExpressAdapter,
//   next : NextAdapter,
};

export class ContextBuilder {
  private context: CLIContext = {};

  setFramework(name: string) {

    if(!name){
      console.log(chalk.yellow("⚠️ framework is not provided , using express as default framework !!!"))
      name = "express"
    }
    this.context.framework = name;
    const adapter = this.createAdapter(name);
    const isValidFramework = adapter.detect();
    if(!isValidFramework){
        console.log(chalk.redBright("❌ Framework is not valid !!!"));
        process.exit(0);
    };

    this.context.adapter= adapter;
  }

  setLanguage(lang: "ts" | "js") {
    if(!lang) console.log(chalk.redBright("⚠️ Language is not provided , default using the js"))
      this.context.lang = lang || "js";
  }
  
  setAuthType(authType: string) {
    if(!authType) console.log(chalk.redBright("⚠️ Auth Type is not provided , default using the jwt"))
    this.context.authType = authType || "jwt";
  }

  setProjectRoot(path: string) {
    if(!path){
      console.log(chalk.redBright("⚠️ Project root is not defined !!!"))
      process.exit(0);
    };
    this.context.projectRoot = path;
  }

  setUserModel(model : string){
    this.context.userModel = model ? model : "User";
  }

  build(): CLIContext {
    return this.context;
  }

  private createAdapter(framework : string) : Adapter{
        const adapter = adapterRegistry[framework];
        if(!adapter){
            console.log(chalk.yellow("🚫 Framework is not supported by automa !!!"));
            process.exit(0);
        }

        return new adapter();
  }
}
