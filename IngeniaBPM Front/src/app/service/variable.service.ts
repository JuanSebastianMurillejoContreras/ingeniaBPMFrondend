import { Injectable } from '@angular/core';
import { VariableByProcedureService } from './variable-by-procedure.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Variable } from '../model/variable';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VariableService extends GenericService<Variable>{

  private examChange: Subject<Variable[]> = new Subject<Variable[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private variableByProcedureService: VariableByProcedureService;


  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/variables`);
  }

  setVariableChange(data: Variable[]){
    this.examChange.next(data);
  }

  getVariableChange(){
    return this.examChange.asObservable();
  }

  removeVariableByProgram(id: number): any {
    return this.variableByProcedureService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
