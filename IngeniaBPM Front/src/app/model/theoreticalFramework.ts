import { CompanyType } from "./companyType"
import { Program } from "./program"

export class TheoreticalFramework{
    idTheoreticalFramework: number
    generalConsiderations: string
    specificConsiderations: string
    urlAnnexed: string
    lstTheoreticalFrameworkByCompanyType: TheoreticalFrameworkByCompanyType[]
    lstTheoreticalFrameworkByProgram: TheoreticalFrameworkByProgram[]

}

export interface TheoreticalFrameworkByCompanyType{
    idTheoreticalFrameworkByCompanyType: number
    theoreticalFramework: TheoreticalFramework
    companyType: CompanyType
}

export interface TheoreticalFrameworkByProgram{
    idTheoreticalFrameworkByProgram: number
    theoreticalFramework: TheoreticalFramework
    program: Program
}