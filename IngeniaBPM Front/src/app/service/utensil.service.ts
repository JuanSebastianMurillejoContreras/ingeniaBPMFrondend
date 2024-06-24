import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Utensil } from '../model/Utensil';
import { GenericService } from './generic.service';
import { UtensilByProcedureService } from './utensil-by-procedure.service';

@Injectable({
  providedIn: 'root'
})
export class UtensilService extends GenericService<Utensil>{

  private examChange: Subject<Utensil[]> = new Subject<Utensil[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private utensilByProcedureService: UtensilByProcedureService;


  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/utensils`);
  }

  setUtensilChange(data: Utensil[]){
    this.examChange.next(data);
  }

  getUtensilChange(){
    return this.examChange.asObservable();
  }

  removeUtensilByProgram(id: number): any {
    return this.utensilByProcedureService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
