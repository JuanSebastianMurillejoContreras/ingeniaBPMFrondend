import { Injectable } from '@angular/core';
import { GeneralGoal } from '../model/generalGoal';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { SpecificGoalService } from './specific-goal.service';
import { SpecificGoal } from '../model/specificGoal';

@Injectable({
  providedIn: 'root'
})
export class GeneralGoalService extends GenericService<GeneralGoal>{

  private examChange: Subject<GeneralGoal[]> = new Subject<GeneralGoal[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private specificGoalService: SpecificGoalService;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/generalgoals`);
    
  }

  setGeneralGoalChange(data: GeneralGoal[]){
    this.examChange.next(data);
  }

  getGeneralGoalChange(){
    return this.examChange.asObservable();
  }


  removeSpecificGoal(id: number): any {
    return this.specificGoalService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
