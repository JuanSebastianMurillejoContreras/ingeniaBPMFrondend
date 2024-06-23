import { Injectable } from '@angular/core';
import { Procedure } from '../model/procedure';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { ProcedureByProgramService } from './procedurebyprogram.service';
import { ProcedureByCompanyTypeService } from './procedurebycompanytype.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService extends GenericService<Procedure>{

  private examChange: Subject<Procedure[]> = new Subject<Procedure[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private procedureByProgramService: ProcedureByProgramService;
  private procedureByCompanyTypeService: ProcedureByCompanyTypeService;


  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedures`);
  }

  setProcedureChange(data: Procedure[]){
    this.examChange.next(data);
  }

  getProcedureChange(){
    return this.examChange.asObservable();
  }

  removeProcedureByProgram(id: number): any {
    return this.procedureByProgramService.delete(id);
  }

  removeProcedureByCompanyType(id: number): any {
    return this.procedureByCompanyTypeService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
