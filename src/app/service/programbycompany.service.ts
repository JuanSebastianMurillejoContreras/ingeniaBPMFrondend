import { Injectable } from '@angular/core';
import { ProgramByCompany } from '../model/programbyCompany';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Program } from '../model/program';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProgrambycompanyService extends GenericService<ProgramByCompany>{
  private examChange: Subject<ProgramByCompany[]> = new Subject<ProgramByCompany[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/programsbycompany`);
  }

  setProgramByCompanyChange(data: ProgramByCompany[]){
    this.examChange.next(data);
  } 

  getProgramByCompanyChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}