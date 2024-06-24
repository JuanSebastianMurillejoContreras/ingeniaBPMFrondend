import { Procedure } from "./Procedure"

export class Supplies{
    idSupplies: number
    suppliesName: string
    lstSuppliesByProcedure: SuppliesByProcedure[]
}

export interface SuppliesByProcedure{
    idSuppliesByProcedure: number
    supplies: Supplies
    procedure: Procedure   
}