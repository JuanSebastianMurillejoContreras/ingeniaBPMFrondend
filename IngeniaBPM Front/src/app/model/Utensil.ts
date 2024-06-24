import { Procedure } from "./Procedure"

export class Utensil{
    idUtensil: number
    utensilName: string
    lstUtensilByProcedure: UtensilByProcedure[]
}

export interface UtensilByProcedure{
    idUtensilByProcedure: number
    utensil: Utensil
    procedure: Procedure
}