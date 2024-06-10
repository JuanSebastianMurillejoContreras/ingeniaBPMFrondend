export interface GeneralGoal {
    idGeneralGoal: number;
    generalGoal: string;
    lstSpecificGoal: SpecificGoal[];
  }
  
  export interface SpecificGoal {
    idSpecificGoal: number;
    specificGoal: string;
  }