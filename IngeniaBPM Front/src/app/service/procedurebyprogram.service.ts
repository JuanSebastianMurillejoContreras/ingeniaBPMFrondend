import { Injectable } from '@angular/core';
import { ProcedureByProgram } from '../model/ProcedureByProgram';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureByProgramService extends GenericService<ProcedureByProgram>{

  listIdProcedure(idProcedure: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<ProcedureByProgram[]> = new Subject<ProcedureByProgram[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedurebyprograms`);
  }

  setProcedureByProgramChange(data: ProcedureByProgram[]){
    this.examChange.next(data);
  }

  getProcedureByProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}