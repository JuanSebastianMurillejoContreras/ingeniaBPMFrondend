import { Procedure } from "./Procedure"

export class Variable{
    idVariable: number
    variableName: string
    referenceValue: string
    expectedValue: string
    lstVariableByProcedure: VariableByProcedure[]
}

export interface VariableByProcedure{
    idVariableByProcedure: number
    variable: Variable
    procedure: Procedure
}