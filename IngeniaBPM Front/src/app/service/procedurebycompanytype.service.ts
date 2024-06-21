import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { ProcedureByCompanyType } from '../model/ProcedureByCompanyType';

@Injectable({
  providedIn: 'root'
})
export class ProcedurebycompanytypeService extends GenericService<ProcedureByCompanyType>{

  private examChange: Subject<ProcedureByCompanyType[]> = new Subject<ProcedureByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/procedurebycompanytypes`);
  }


  setProcedureByCompanyTypeChange(data: ProcedureByCompanyType[]){
    this.examChange.next(data);
  }

  getProcedureByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}