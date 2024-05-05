import { Injectable } from '@angular/core';
import { Glossary } from '../model/glossary';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService extends GenericService<Glossary>{
  
  private examChange: Subject<Glossary[]> = new Subject<Glossary[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/glossaries`);
  }

  setGlossaryChange(data: Glossary[]){
    this.examChange.next(data);
  }

  getGlossaryChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}

