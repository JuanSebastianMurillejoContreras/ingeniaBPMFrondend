import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GenericService } from './generic.service';
import { GlossaryByProgram } from '../model/GlossaryByProgram';

@Injectable({
  providedIn: 'root'
})
export class GlossaryByProgramService extends GenericService<GlossaryByProgram>{

  private examChange: Subject<GlossaryByProgram[]> = new Subject<GlossaryByProgram[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/glossarybyprograms`);
  }

  setGlossaryByProgramChange(data: GlossaryByProgram[]){
    this.examChange.next(data);
  }

  getGlossaryByProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

