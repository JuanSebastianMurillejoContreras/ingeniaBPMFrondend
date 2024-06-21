import { Injectable } from '@angular/core';
import { ScopeByCompanyType } from '../model/ScopeByCompanyType';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ScopebycompanytypeService  extends GenericService<ScopeByCompanyType>{

  private examChange: Subject<ScopeByCompanyType[]> = new Subject<ScopeByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/scopebycompanytypes`);
  }


  setScopeChange(data: ScopeByCompanyType[]){
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
