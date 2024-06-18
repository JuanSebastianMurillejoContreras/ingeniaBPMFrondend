import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Program } from '../model/program';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends GenericService<Program>{
  list(): any {
    throw new Error('Method not implemented.');
  }
  private examChange: Subject<Program[]> = new Subject<Program[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/programs`);
  }

  setProgramChange(data: Program[]){
    this.examChange.next(data);
  } 

  getProgramChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}