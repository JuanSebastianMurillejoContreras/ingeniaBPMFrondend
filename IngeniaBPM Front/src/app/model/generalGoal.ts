import { CompanyType } from "./companyType";
import { generalGoalByCompanyType } from "./generalGoalByCompanyType";
import { Program } from "./program";

export class GeneralGoal {
    idGeneralGoal: number;
    generalGoal: string;
    lstSpecificGoal: SpecificGoal[];
    lstGeneralGoalByProgram: GeneralGoalByProgram[];
    lstGeneralGoalByCompanyType: generalGoalByCompanyType[];
  }
  
  export interface SpecificGoal {
    idGeneralGoal: any;
    idSpecificGoal: number;
    specificGoal: string;
  }

  export interface GeneralGoalByProgram{
    idGeneralGoalByProgram: number;
    GeneralGoal: GeneralGoal;
    program: Program;
   
}

export interface GeneralGoalByCompanyType{
  idGeneralGoalByCompanyType: number;
  GeneralGoal: GeneralGoal;
  companyType: CompanyType;
 
}