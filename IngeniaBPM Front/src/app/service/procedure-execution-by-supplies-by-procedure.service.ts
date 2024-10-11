import { Injectable } from '@angular/core';
import { ProcedureExecutionBySuppliesByProcedure } from '../model/ProcedureExecutionBySuppliesByProcedure';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureExecutionBySuppliesByProcedureService extends GenericService<ProcedureExecutionBySuppliesByProcedure>{

  private examChange: Subject<ProcedureExecutionBySuppliesByProcedure[]> = new Subject<ProcedureExecutionBySuppliesByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/ProcedureExecutionBySuppliesByProcedure`);
  }

  setProcedureExecutionBySuppliesByProcedureChange(data: ProcedureExecutionBySuppliesByProcedure[]){
    this.examChange.next(data);
  }

  getProcedureExecutionBySuppliesByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
