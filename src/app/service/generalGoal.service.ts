import { Injectable } from '@angular/core';
import { GeneralGoal } from '../model/generalGoal';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CompanyType } from '../model/companyType';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalService extends GenericService<GeneralGoal>{

  private examChange: Subject<GeneralGoal[]> = new Subject<GeneralGoal[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/generalgoals`);
  }


  setGeneralGoalChange(data: GeneralGoal[]){
    this.examChange.next(data);
  }

  getGeneralGoalChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
