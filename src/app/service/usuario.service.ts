import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Cliente } from '../model/cliente';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{

  private examChange: Subject<Usuario[]> = new Subject<Usuario[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/users`);
  }


  setUsuarioChange(data: Usuario[]){
    this.examChange.next(data);
  }

  getUsuarioChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
