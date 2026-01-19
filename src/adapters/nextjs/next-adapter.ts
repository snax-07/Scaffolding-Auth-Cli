import type { Adapter, GenerationPlan, ValidationResult } from "../adapter.interface";
import fs from  'fs-extra'
import path from 'path'

export class NextAdapter implements Adapter{
    framework: string = "next";
    routing?: string;



    /*THIS ACT LIKE SIMPLE CHECK WHICH CHACK THAT GIVEN FRAMEWORK IS VALID OR NOT BY CHECKING THEIR INSTALLED DEPENDENCIES FROM PCAKAGE.JSON AND THIS ENSURE THAT 
        BEFORE CREATING THE FILE THAT DEV ENV IS VALID FOR THAT FREAMEWORK
    */
    detect(): boolean {
        const projectRoot = process.cwd();
        const json = fs.readJSONSync(path.join(projectRoot , "package.json") , "utf8");
        if(Object.hasOwn(json?.dependencies , "next")) return true;
        return false;
    };

    mapAuth(authType: string): GenerationPlan {
        let plan = {};

        if(authType === "jwt"){
            if(this.routing && this.routing === "app"){
                plan = {
                    files : [
                        {
                            template : "jwt/next/auth/route",
                            target : "app/api/auth/route"
                        },{
                            template : "jwt/next/models",
                            target : "model/userModel"
                        },{
                            template  : "jwt/next/config/dbConnect",
                            target : "lib/dbConnect"
                        }
                    ],
                    env : ["JWT_SECRET"],
                    warning : [
                        "Please ensure that project is breaked or not due to scaffolding and mis-configuration !!!"
                    ],
                    hooks : ["app"]
                }
            }
        }


        return plan as GenerationPlan
    }

    validate(plan: GenerationPlan, lang: "js" | "ts"): ValidationResult {
        const projectRoot = process.cwd();
        for(const p of plan.hooks){
            if(fs.existsSync(path.join(projectRoot , p))){
                return {
                    valid : true,
                    warnings : [
                        "This is script assumption that this project consist of your provided routing and it is passed that test !!!!"
                    ],
                    errors : []
                } as ValidationResult
            }
        }

        return {
            valid : false,
            warnings : [],
            errors : [
                " 💀 Provided routing is not supported or not available in root !!!"
            ]
        } as ValidationResult;
    }
}