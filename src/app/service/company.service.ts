import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Company } from '../model/company';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends GenericService<Company>{

  private examChange: Subject<Company[]> = new Subject<Company[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/companies`);
  }


  setCompanyChange(data: Company[]){
    this.examChange.next(data);
  }

  getCompanyChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
