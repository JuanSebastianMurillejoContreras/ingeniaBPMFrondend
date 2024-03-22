import { Injectable } from '@angular/core';
import { SpecificGoal } from '../model/specificGoal';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SpecificGoalService extends GenericService<SpecificGoal>{
  private examChange: Subject<SpecificGoal[]> = new Subject<SpecificGoal[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specificgoals`);
  }

  setSpecificGoalChange(data: SpecificGoal[]){
    this.examChange.next(data);
  }

  getSpecificGoalChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

