import path from "path";
import type { Adapter, GenerationPlan, ValidationResult } from "../adapter.interface";
import fs from 'fs-extra'

export class ExpressAdapter implements Adapter {
    framework: string = "express";

    detect(): boolean {
        const projectRoot = process.cwd();
        const json = fs.readJSONSync(path.join(projectRoot , "package.json") , "utf8");
        if(Object.hasOwn(json?.dependencies , "express")) return true;

        return false;
    }

    mapAuth(authType: string): GenerationPlan {

        let plan  = {};
        if(authType == "jwt"){
            plan =  {
                files : [
                    {
                        template : "express/controller/auth.controller",
                        target : "controller/auth.controller"
                    },
                    {
                        template : "express/middleware/auth.middleware",
                        target : 'middleware/auth.middleware'
                    },
                    {
                        template : "express/route/auth.route",
                        target : "route/auth.route"
                    },
                    {
                        template : "jwt/jwt",
                        target : "utils/jwt"
                    }
                ],
                env : [
                    "JWT_SECRET"
                ],
                hooks : ["app", "index" , "server"],
                warnings : [
                    "Please define JWT secret in env othrwise you are comprimising the sec !!!"
                ]
            }
        }else if(authType = "session"){

        }
        return plan as GenerationPlan
    }

    validate(plan: GenerationPlan , lang : "js" | "ts"): ValidationResult {
        const projectRoot = process.cwd();
        for(const hook of plan.hooks){
            if(fs.existsSync(path.join(projectRoot ,  `${hook}.${lang}`))){
                return {
                    valid : true,
                    warnings : [],
                    errors : []
                }
            }
        }


        return {
            valid : false,
            warnings : [],
            errors : [
                "💀 Server entry is not located !!!"
            ]
        }
    }
    
}