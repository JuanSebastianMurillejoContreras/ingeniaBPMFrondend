import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { VariableByProcedure } from '../model/variable';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VariableByProcedureService extends GenericService<VariableByProcedure>{
  
  listIdProcedure(idProcedure: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<VariableByProcedure[]> = new Subject<VariableByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/variablebyprocedures`);
  }

  setVariableByProcedureChange(data: VariableByProcedure[]){
    this.examChange.next(data);
  }

  getVariableByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}