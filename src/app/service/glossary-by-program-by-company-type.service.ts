import { Injectable } from '@angular/core';
import { GlossaryByProgramByCompanyType } from '../model/GlossaryByProgramByCompanyType';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GlossaryByProgramByCompanyTypeService extends GenericService<GlossaryByProgramByCompanyType>{

  private examChange: Subject<GlossaryByProgramByCompanyType[]> = new Subject<GlossaryByProgramByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/glossaryByProgramByCompanyTypes`);
  }

  setGlossaryByProgramByCompanyTypeChange(data: GlossaryByProgramByCompanyType[]){
    this.examChange.next(data);
  }

  getGlossaryByProgramByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

