import { Injectable } from '@angular/core';
import { GlossaryByCompanyType } from '../model/GlossaryByCompanyType';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class GlossaryByCompanyTypeService extends GenericService<GlossaryByCompanyType>{

  private examChange: Subject<GlossaryByCompanyType[]> = new Subject<GlossaryByCompanyType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/glossarybycompanytypes`);
  }

  setGlossaryByCompanyTypeChange(data: GlossaryByCompanyType[]){
    this.examChange.next(data);
  }

  getGlossaryByCompanyTypeChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
