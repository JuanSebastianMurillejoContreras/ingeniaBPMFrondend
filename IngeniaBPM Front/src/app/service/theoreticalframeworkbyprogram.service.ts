import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { TheoreticalFramework } from '../model/theoreticalFramework';
import { TheoreticalFrameworkByProgramByCompanyType } from '../model/TheoreticalFrameworkByProgramByCompanyType';
import { TheoreticalFrameworkByProgram } from '../model/TheoreticalFrameworkByProgram';

@Injectable({
  providedIn: 'root'
})
export class TheoreticalFrameworkByProgramService extends GenericService<TheoreticalFrameworkByProgram>{

  private examChange: Subject<TheoreticalFrameworkByProgram[]> = new Subject<TheoreticalFrameworkByProgram[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/theoreticalframeworkbyprograms`);
  }

  setTheoreticalFrameworkByProgramChange(data: TheoreticalFrameworkByProgram[]){
    this.examChange.next(data);
  }

  getTheoreticalFrameworkByProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
