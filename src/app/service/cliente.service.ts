import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Cliente } from '../model/cliente';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente>{

  private examChange: Subject<Cliente[]> = new Subject<Cliente[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/clients`);
  }


  setClienteChange(data: Cliente[]){
    this.examChange.next(data);
  }

  getClienteChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
