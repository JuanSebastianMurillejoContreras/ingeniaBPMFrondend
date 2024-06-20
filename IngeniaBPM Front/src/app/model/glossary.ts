import { CompanyType } from "./companyType";
import { Program } from "./program";


export class Glossary{
    idGlossary: number;
    word: string;
    definition: string;
    lstGlossaryByProgram: GlossaryByProgram[];
    lstGlossaryByCompanyType: GlossaryByCompanyType[]; 
}

export interface GlossaryByProgram{
    idGlossaryByProgram: number
    glossary: Glossary
    program: Program
   
}

export interface GlossaryByCompanyType{
    idGlossaryByCompanyType: number
    glossary: Glossary
    companyType: CompanyType
 
}