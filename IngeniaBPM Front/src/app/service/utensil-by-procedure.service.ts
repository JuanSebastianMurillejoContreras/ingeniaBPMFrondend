import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UtensilByProcedure } from '../model/Utensil';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class UtensilByProcedureService extends GenericService<UtensilByProcedure>{
  
  listIdProcedure(idProcedure: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<UtensilByProcedure[]> = new Subject<UtensilByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/utensilbyprocedures`);
  }


  setUtensilByProcedureChange(data: UtensilByProcedure[]){
    this.examChange.next(data);
  }

  getUtensilByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}