import { CompanyType } from "./companyType"
import { Department } from "./department"

export class Cliente{
    idClient: number
    companyType: CompanyType
    nit: number
    name: string
    logoURL: string
    department: Department
    city: string
    address: string
    mail: string
    phone: string
    numberEmployee: string
    size: string
    guarded: string
    recordingDate: string
    recordedUser: string
}