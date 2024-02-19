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
  private apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json?';

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

