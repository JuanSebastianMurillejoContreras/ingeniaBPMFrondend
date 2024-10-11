import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProcedureExecutionByUtensilByProcedure } from '../model/ProcedureExecutionByUtensilByProcedure';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureExecutionByUtensilByProcedureService extends GenericService<ProcedureExecutionByUtensilByProcedure>{

  private examChange: Subject<ProcedureExecutionByUtensilByProcedure[]> = new Subject<ProcedureExecutionByUtensilByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/ProcedureExecutionByUtensilByProcedure`);
  }

  setProcedureExecutionByUtensilByProcedureChange(data: ProcedureExecutionByUtensilByProcedure[]){
    this.examChange.next(data);
  }

  getProcedureExecutionByUtensilByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
