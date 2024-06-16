import { Injectable } from '@angular/core';
import { GeneralGoalByProgramByCompanyType } from '../model/generalGoalByProgramByCompanyType';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalByProgramByCompanyTypeService extends GenericService<GeneralGoalByProgramByCompanyType>{

  private examChange: Subject<GeneralGoalByProgramByCompanyType[]> = new Subject<GeneralGoalByProgramByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/generalgoalbyprogrambycompanytypes`);
  }

  setGeneralGoalByProgramByCompanyTypeChange(data: GeneralGoalByProgramByCompanyType[]){
    this.examChange.next(data);
  }

  getGeneralGoalByProgramByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
