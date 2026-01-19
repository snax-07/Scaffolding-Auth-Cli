

export interface FileMapping {
  template: string;   
  target: string;     
}

export interface GenerationPlan {
  files: FileMapping[];
  env: string[];
  hooks: string[];
  warnings: string[];
  refuse?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export interface Adapter {
  framework: string;
  routing ?: string

  detect(): boolean;

  mapAuth(authType: string): GenerationPlan;

  validate(plan: GenerationPlan , lang : "js" | "ts"): ValidationResult;
}


export interface MappedFile{
  templatePath : string,
  outputPath : string,
  overwrite : Boolean
}