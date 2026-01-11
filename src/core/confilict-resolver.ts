import chalk from "chalk";
import type { MappedFile } from "../adapters/adapter.interface.ts";
import fs from "fs-extra"
import inquirer from "inquirer";

export default async function ConflictResolver(
    plan : MappedFile[]
) {
    try {
        const resolvedPlan : MappedFile[] = [];
        for(const singlePlan of plan){
            if(!fs.existsSync(singlePlan.outputPath)){
                resolvedPlan.push(singlePlan);
                continue;
            };

            console.log(chalk.redBright("⚠️ File already exists !!!"));
            console.log(chalk.gray(singlePlan.outputPath));

            const action = await inquirer.prompt([
                {
                    type : "confirm",
                    name : "overwrite",
                    message : "Do you want to overwrite ?"
                }
            ]);

            resolvedPlan.push({
                ...singlePlan,
                overwrite : action.overwrite
            });
        }
        return resolvedPlan;
    } catch (error) {
        console.log(chalk.redBright("⚠️ Error while conflicting file !!!"));
        process.exit(0);
    }
}