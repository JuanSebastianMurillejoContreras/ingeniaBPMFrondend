import { CompanyType } from "./companyType"
import { Program } from "./program"
import { Scope } from "./scope"

export class Procedure {
    idProcedure: number
    code: string
    name: string
    description: string
    frequency: string
    observations: string
    responsible: string
    lstProcedureByCompanyType: ProcedureByCompanyType[]
    lstProcedureByProgram: ProcedureByProgram[]
}

export interface ProcedureByCompanyType{
    idProcedureByCompanyType: number
    scope: Scope
    companyType: CompanyType
}

export interface ProcedureByProgram{
    idProcedureByProgram: number
    scope: Scope
    program: Program
}