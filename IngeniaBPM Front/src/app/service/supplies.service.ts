import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Supplies } from '../model/Supplies';
import { GenericService } from './generic.service';
import { SuppliesByProcedureService } from './supplies-by-procedure.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliesService extends GenericService<Supplies>{

  private examChange: Subject<Supplies[]> = new Subject<Supplies[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private suppliesByProcedureService: SuppliesByProcedureService;


  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/supplies`);
  }

  setSuppliesChange(data: Supplies[]){
    this.examChange.next(data);
  }

  getSuppliesChange(){
    return this.examChange.asObservable();
  }

  removeSuppliesByProgram(id: number): any {
    return this.suppliesByProcedureService.delete(id);
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
