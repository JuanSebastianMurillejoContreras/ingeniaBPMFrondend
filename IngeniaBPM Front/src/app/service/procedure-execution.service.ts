import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProcedureExecution } from '../model/ProcedureExecution';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureExecutionService extends GenericService<ProcedureExecution>{

  private examChange: Subject<ProcedureExecution[]> = new Subject<ProcedureExecution[]>;
  private messageChange: Subject<string> = new Subject<string>;



  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedureexecution`);
  }

  setProcedureExecutionChange(data: ProcedureExecution[]){
    this.examChange.next(data);
  }

  getProcedureExecutionChange(){
    return this.examChange.asObservable();
  }


  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
