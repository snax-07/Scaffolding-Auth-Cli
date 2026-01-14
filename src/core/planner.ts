
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import type { CLIContext } from "../cli/context";
import type { GenerationPlan } from "../adapters/adapter.interface";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// templates root (inside CLI project)
const TEMPLATE_ROOT = path.resolve(__dirname, "../../src/template");

export function BuildFilePlan(
    context : CLIContext,
    plan : GenerationPlan
){
    const projectRoot = context.projectRoot;
    if(!projectRoot){
        throw new Error("Project root is not defined !!!")
    };

    const SRC_ROOT = path.join(projectRoot , "src");
    return plan.files.map(file => {
        const templatePath = path.join(TEMPLATE_ROOT  , context.lang as string, `${file.template}.${context.lang}`);
        const outputPath = path.join(SRC_ROOT,`${file.target}.${context.lang}`);

        return {
            templatePath,
            outputPath,
            overwrite: false,
        };
    })
}