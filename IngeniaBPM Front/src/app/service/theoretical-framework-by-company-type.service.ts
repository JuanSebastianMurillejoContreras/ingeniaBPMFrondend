import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class TheoreticalFrameworkByCompanyTypeService extends GenericService<TheoreticalFrameworkByCompanyTypeService>{

  private examChange: Subject<TheoreticalFrameworkByCompanyTypeService[]> = new Subject<TheoreticalFrameworkByCompanyTypeService[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/theoreticalframeworkbycompanytypes`);
  }

  setTheoreticalFrameworkByCompanyTypeChange(data: TheoreticalFrameworkByCompanyTypeService[]){
    this.examChange.next(data);
  }

  getTheoreticalFrameworkByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
