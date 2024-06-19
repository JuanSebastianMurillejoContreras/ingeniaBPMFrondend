import { Injectable } from '@angular/core';
import { GeneralGoal } from '../model/generalGoal';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { SpecificGoalService } from './specific-goal.service';
import { GeneralGoalByProgramService } from './generalgoalbyprogram.service';
import { GeneralGoalByCompanyTypeService } from './generalgoalbycompanytype.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalService extends GenericService<GeneralGoal>{
  listId(id: number) {
    throw new Error('Method not implemented.');
  }

  private GeneralGoalChange: Subject<GeneralGoal[]> = new Subject<GeneralGoal[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private specificGoalService: SpecificGoalService;
  private generalGoalByProgramService: GeneralGoalByProgramService;
  private generalGoalByCompanyTypeService: GeneralGoalByCompanyTypeService;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/generalgoals`);
    
  }

  setGeneralGoalChange(data: GeneralGoal[]){
    this.GeneralGoalChange.next(data);
  }

  getGeneralGoalChange(){
    return this.GeneralGoalChange.asObservable();
  }

  removeSpecificGoal(id: number): any {
    return this.specificGoalService.delete(id);
  }

  removeGeneralGoalByProgram(id: number): any {
    return this.generalGoalByProgramService.delete(id);
  }

  removeGeneralGoalByCompanyType(id: number): any {
    return this.generalGoalByCompanyTypeService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
