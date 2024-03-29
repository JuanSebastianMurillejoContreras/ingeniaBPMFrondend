import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TheoreticalFramework } from '../model/theoreticalFramework';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class TheoreticalFrameworkService extends GenericService<TheoreticalFramework>{

  private examChange: Subject<TheoreticalFramework[]> = new Subject<TheoreticalFramework[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/theoreticalframeworks`);
  }


  setTheoreticalFrameworkChange(data: TheoreticalFramework[]){
    this.examChange.next(data);
  }

  getTheoreticalFrameworkChange(){
    return this.examChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
