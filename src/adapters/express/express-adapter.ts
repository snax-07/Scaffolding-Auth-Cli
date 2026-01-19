import path from "path";
import type { Adapter, GenerationPlan, ValidationResult } from "../adapter.interface";
import fs from 'fs-extra'

export class ExpressAdapter implements Adapter {
    framework: string = "express";

    /*THIS ACT LIKE SIMPLE CHECK WHICH CHACK THAT GIVEN FRAMEWORK IS VALID OR NOT BY CHECKING THEIR INSTALLED DEPENDENCIES FROM PCAKAGE.JSON AND THIS ENSURE THAT 
        BEFORE CREATING THE FILE THAT DEV ENV IS VALID FOR THAT FREAMEWORK
    */
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
                        template : "jwt/express/config/dbConnect",
                        target : "config/dbConnect"
                    },
                    {
                        template : "jwt/express/middleware/authMiddleware",
                        target : "middleware/authMiddleware"
                    },
                    {
                        template : "jwt/express/controllers/authController",
                        target : "controllers/authControllers"
                    },
                    {
                        template : "jwt/express/models/userModel",
                        target : "models/userModel"
                    },
                    {
                        template : "jwt/express/routes/authRoutes",
                        target : "routes/authRoutes"
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
            plan = {
                files : [
                    {
                        template : "session/express/config/dbConnect",
                        target : "config/dbConnect"
                    },
                    {
                        template : "session/express/controllers/authController",
                        target : "controllers/authController"
                    },
                    {
                        template : "session/express/routes/authRoute",
                        target : "routes/authRoute"
                    },
                    {
                        template : "session/express/middleware/authMiddleware",
                        target : "middleware/authMiddleware"
                    },
                    {
                        template : "session/express/models/userModel",
                        target : "models/userModel"
                    }
                ],
                env : [],
                hooks : ["app" , "index" , "server"],
                warnings : [
                    "Please read official docs for any confusion or reach out the dev for this query 😊 !!!!"
                ]
            }
        }
        return plan as GenerationPlan
    }

    validate(plan: GenerationPlan , lang : "js" | "ts"): ValidationResult {
        const projectRoot = process.cwd();
        for(const hook of plan.hooks){
            if(fs.existsSync(path.join(projectRoot ,  `${hook}.js`))){
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