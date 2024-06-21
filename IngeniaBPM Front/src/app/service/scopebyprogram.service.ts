import { Injectable } from '@angular/core';
import { ScopeByProgram } from '../model/ScopeByProgram';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ScopeByProgramService  extends GenericService<ScopeByProgram>{

  private examChange: Subject<ScopeByProgram[]> = new Subject<ScopeByProgram[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/scopebyprograms`);
  }


  setScopeByProgramChange(data: ScopeByProgram[]){
    this.examChange.next(data);
  }

  getScopeByProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}
