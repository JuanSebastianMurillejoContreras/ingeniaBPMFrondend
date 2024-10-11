import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProcedureExecutionByVariableByProcedure } from '../model/ProcedureExecutionByVariableByProcedure';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureExecutionByVariableByProcedureService extends GenericService<ProcedureExecutionByVariableByProcedure>{

  private examChange: Subject<ProcedureExecutionByVariableByProcedure[]> = new Subject<ProcedureExecutionByVariableByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedureexecutionbyvariablebyprocedure`);
  }

  setProcedureExecutionByVariableByProcedureChange(data: ProcedureExecutionByVariableByProcedure[]){
    this.examChange.next(data);
  }

  getProcedureExecutionByVariableByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
