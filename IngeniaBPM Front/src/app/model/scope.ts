import { CompanyType } from "./companyType"
import { Program } from "./program"
import { TheoreticalFramework } from "./theoreticalFramework"

export class Scope {
    idScope: number
    definitionScope: string
    lstScopeByCompanyType: ScopeByCompanyType[]
    lstScopeByProgram: ScopeByProgram[]
}

export interface ScopeByCompanyType {
    idScopeByCompanyType: number
    scope: Scope
    companyType: CompanyType
}

export interface ScopeByProgram {
    idScopeByProgram: number
    scope: Scope
    program: Program
}