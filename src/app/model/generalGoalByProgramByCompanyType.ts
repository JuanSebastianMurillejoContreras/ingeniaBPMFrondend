import { CompanyType } from "./companyType";
import { GeneralGoal } from "./generalGoal";
import { Program } from "./program";

export class GeneralGoalByProgramByCompanyType{
    idGeneralGoalByProgramByCompanyType: number;
    program: Program;
    companyType: CompanyType;
    generalGoal: GeneralGoal;
}