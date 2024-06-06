import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { TheoreticalFramework } from '../model/theoreticalFramework';
import { TheoreticalFrameworkByProgramByCompanyType } from '../model/TheoreticalFrameworkByProgramByCompanyType';

@Injectable({
  providedIn: 'root'
})
export class TheoreticalFrameworkByProgramByCompanyTypeService extends GenericService<TheoreticalFrameworkByProgramByCompanyType>{

  private examChange: Subject<TheoreticalFrameworkByProgramByCompanyType[]> = new Subject<TheoreticalFrameworkByProgramByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/theoriticalframeworkbyprogrambycompanytypes`);
  }

  setTheoreticalFrameworkByProgramByCompanyTypeChange(data: TheoreticalFrameworkByProgramByCompanyType[]){
    this.examChange.next(data);
  }

  getTheoreticalFrameworkByProgramByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
