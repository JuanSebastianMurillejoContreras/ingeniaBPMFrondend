import { Injectable } from '@angular/core';
import { Department } from '../model/department';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/cliente';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends Department{

  private examChange: Subject<Department[]> = new Subject<Department[]>;
  private messageChange: Subject<string> = new Subject<string>;
  private apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json?$query=SELECT%0A%20%20%60region%60%2C%0A%20%20%60c_digo_dane_del_departamento%60%2C%0A%20%20%60departamento%60%2C%0A%20%20%60c_digo_dane_del_municipio%60%2C%0A%20%20%60municipio%60%0ASEARCH%20%22Tolima%22';

  constructor(protected http: HttpClient) {
    super();
  }

  findAll(){
    return this.http.get<Department[]>(this.apiUrl);
  }

  setExamChange(data: Department[]): void {
    this.examChange.next(data);
  }

  getExamChange(): Observable<Department[]> {
    return this.examChange.asObservable();
  }

  setMessageChange(data: string): void {
    this.messageChange.next(data);
  }

  getMessageChange(): Observable<string> {
    return this.messageChange.asObservable();
  }
}

