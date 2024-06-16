import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { CompanyType } from '../model/companyType';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService extends GenericService<CompanyType>{

  private examChange: Subject<CompanyType[]> = new Subject<CompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/companytypes`);
  }


  setCompanyTypeChange(data: CompanyType[]){
    this.examChange.next(data);
  }

  getCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
