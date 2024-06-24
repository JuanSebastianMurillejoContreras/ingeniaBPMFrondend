import { Injectable } from '@angular/core';
import { Scope } from '../model/scope';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GeneralGoal } from '../model/generalGoal';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ScopeService extends GenericService<Scope>{

  private examChange: Subject<Scope[]> = new Subject<Scope[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/scopes`);
  }

  setScopeChange(data: Scope[]){
    this.examChange.next(data);
  }

  getScopeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
