import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SuppliesByProcedure } from '../model/Supplies';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliesByProcedureService extends GenericService<SuppliesByProcedure>{
  
  listIdProcedure(idProcedure: any): any {
    throw new Error('Method not implemented.');
  }

  private examChange: Subject<SuppliesByProcedure[]> = new Subject<SuppliesByProcedure[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/suppliesbyprocedures`);
  }


  setSuppliesByProcedureChange(data: SuppliesByProcedure[]){
    this.examChange.next(data);
  }

  getSuppliesByProcedureChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}