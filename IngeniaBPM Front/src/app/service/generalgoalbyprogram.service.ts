import { Injectable } from '@angular/core';
import { GeneralGoalByProgram } from '../model/generalGoalByProgram';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalByProgramService extends GenericService<GeneralGoalByProgram>{
  listIdGeneralGoal(idGeneralGoal: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<GeneralGoalByProgram[]> = new Subject<GeneralGoalByProgram[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/Generalgoalbyprograms`);
  }

  setGeneralGoalByProgramChange(data: GeneralGoalByProgram[]){
    this.examChange.next(data);
  }

  getGeneralGoalByProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}