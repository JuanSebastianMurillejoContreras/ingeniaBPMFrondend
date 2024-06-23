import { Injectable } from '@angular/core';
import { generalGoalByCompanyType } from '../model/generalGoalByCompanyType';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalByCompanyTypeService extends GenericService<generalGoalByCompanyType>{
 
  listIdGeneralGoal(idGeneralGoal: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<generalGoalByCompanyType[]> = new Subject<generalGoalByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/Generalgoalbycompanytypes`);
  }

  setGeneralGoalByCompanyTypeChange(data: generalGoalByCompanyType[]){
    this.examChange.next(data);
  }

  getGeneralGoalByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
