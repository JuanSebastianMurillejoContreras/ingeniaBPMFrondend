import { CompanyType } from "./companyType";
import { Glossary } from "./glossary";
import { Program } from "./program";

export class GlossaryByProgramByCompanyType{
    idGlossaryByProgramByCompanyType: number;
    program: Program;
    companyType: CompanyType;
    glossary: Glossary;
}