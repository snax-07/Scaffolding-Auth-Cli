import chalk from "chalk";
import { ContextBuilder } from "../cli/context.ts";
import { BuildFilePlan } from "../core/planner.ts";
import type { GenerationPlan } from "../adapters/adapter.interface.ts";
import ConflictResolver from "../core/confilict-resolver.ts";
import Executor from "../core/executor.ts";

export type commanderOption = {
    framework :  string,
    auth      :  string,
    lang      : "ts" | "js",
    usermodel ?: string
}
export default async function INIT(options : commanderOption){
    try {

        //THIS WILL HOLD THE USERS ROOT FOLDER LOCATION 
        const projectRoot = process.cwd();

        const contextBUilder = new ContextBuilder();
        contextBUilder.setFramework(options.framework);
        contextBUilder.setLanguage(options.lang as "ts" | "js");
        contextBUilder.setAuthType(options.auth as string);
        contextBUilder.setUserModel(options.usermodel as string);
        contextBUilder.setProjectRoot(projectRoot as string);
        const context = contextBUilder.build();


        //BEFORE PROCESSING THE ANY OTHER CASE JUST VALIDATE THE SERVER OR ROOT FILE IS EXIST IN SRCROOT
        const isValid = context.adapter?.validate(context.adapter.mapAuth(context.authType as string) , context.lang as "ts" | "js").valid;
        console.log(isValid)
        if(!isValid){
            console.log(chalk.red("💀 Server main file is not found !!!"));
            console.log(chalk.gray("Make sure that server entry point should be defined so make sure that backend entry point should be present which named as the APP , SERVER , INDEX."));
            process.exit(0);
        }
        //THIS WILL IDENTIFY AND GIVE THE FILE PATH

        const planBuild = BuildFilePlan(context , context.adapter?.mapAuth(context.authType as string) as GenerationPlan);
        const conflictsResolvedPlan =  await ConflictResolver(planBuild);
        Executor(conflictsResolvedPlan , context);
        console.log(chalk.whiteBright.bold("Auth Creation completed !!!"));
    } catch (error : any) {
        console.log(chalk.red("💀 Something is really wrong !!!"));
        console.log(chalk.yellowBright(error.message || error))
        process.exit(0);
    }
}