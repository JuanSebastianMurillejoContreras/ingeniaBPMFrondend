import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { TheoreticalFrameworkByProgram } from '../model/TheoreticalFrameworkByProgram';

@Injectable({
  providedIn: 'root'
})
export class TheoreticalFrameworkByProgramService extends GenericService<TheoreticalFrameworkByProgram>{

  listIdTheoreticalFramework(idTheoreticalFramework: any): any {
    throw new Error('Method not implemented.');
  }

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
