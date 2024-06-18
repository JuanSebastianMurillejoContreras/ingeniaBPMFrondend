import { CompanyType } from "./companyType";
import { Program } from "./program";

export class GeneralGoal {
    idGeneralGoal: number;
    generalGoal: string;
    lstSpecificGoal: SpecificGoal[];
    lstGeneralGoalByProgramByCompanyType: GeneralGoalByProgramByCompanyType[];
  }
  
  export interface SpecificGoal {
    idGeneralGoal: any;
    idSpecificGoal: number;
    specificGoal: string;
  }

  export interface GeneralGoalByProgramByCompanyType{
    idGeneralGoalByProgramByCompanyType: number;
    program: Program;
    companyType: CompanyType;
    generalGoal: GeneralGoal;
}