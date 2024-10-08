import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, startWith, map, of, forkJoin, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Procedure } from 'src/app/model/Procedure';
import { Utensil } from 'src/app/model/Utensil';
import { UtensilByProcedure } from 'src/app/model/UtensilByProcedure';
import { ProcedureService } from 'src/app/service/procedure.service';
import { UtensilByProcedureService } from 'src/app/service/utensil-by-procedure.service';
import { UtensilService } from 'src/app/service/utensil.service';

@Component({
  selector: 'app-utensil-edit',
  standalone: true,
  templateUrl: './utensil-edit.component.html',
  styleUrls: ['./utensil-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class UtensilEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeleteutensilByProgramService: number[] = [];
  idsToDeleteutensilByUtensilService: number[] = [];

  procedure: Procedure[];
  procedureControl: FormControl = new FormControl();
  procedureFiltered$: Observable<Procedure[]>;

  utensilByProcedure: UtensilByProcedure[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private utensilService: UtensilService,
    private procedureService: ProcedureService,
    private utensilByProcedureService: UtensilByProcedureService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idUtensil: [0],
      utensilName: ['', Validators.required],
      lstUtensilByProcedure: this.fb.array([])
    });

    this.loadInitialData();
    this.procedureFiltered$ = this.procedureControl.valueChanges.pipe(startWith(''), map(val => this.filterProcedure(val)));

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;
      this.initForm();
    });
  }

  filterProcedure(val: any): Procedure[] {
    if (!val || typeof val !== 'string') {
      return [];
    }
    return this.procedure.filter(el =>
      el.name.toLowerCase().includes(val.toLowerCase())
    );
  }


  loadInitialData() {
    this.procedureService.findAll().subscribe(data => this.procedure = data);
  }


  showProcedure(val: any) {
    return val ? `${val.name}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.utensilService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idUtensil: data.idUtensil,
          utensilName: data.utensilName
        });
        this.setUtensilByProcedure(data.lstUtensilByProcedure);
        console.log(data);
      });
    }
  }

  setUtensilByProcedure(s: UtensilByProcedure[]) {
    const lsts = this.form.get('lstUtensilByProcedure') as FormArray;
    s.forEach(procedure => {
      lsts.push(this.fb.group({
        idUtensilByProcedure: [procedure.idUtensilByProcedure],
        procedure: [procedure.procedure, Validators.required]
      }));
    });
  }

  get utensilByProcedures() {
    return this.form.get('lstUtensilByProcedure') as FormArray;
  }

  addUtensilByProcedure() {
    this.utensilByProcedures.push(this.fb.group({
      idUtensilByProcedure: [0],
      procedure: ['', Validators.required]
    }));
  }

  removeUtensilByProcedure(index: number) {
    const s = this.utensilByProcedures.at(index).value;
    if (s.idUtensilByProcedure) {
      this.idsToDeleteutensilByUtensilService.push(s.idUtensilByProcedure);
    }
    this.utensilByProcedures.removeAt(index);
  }

  deleteUtensilByProcedure(): Observable<any> {
    if (this.idsToDeleteutensilByUtensilService.length === 0) {
      return of(null);
    }
    const deleteUtensilByProcedure$ = this.idsToDeleteutensilByUtensilService.map(id =>
      this.utensilByProcedureService.delete(id)
    );
    return forkJoin(deleteUtensilByProcedure$);
  }


  saveOrUpdateUtensil(utensil: Utensil): Observable<any> {
    if (this.isEdit) {
      return this.utensilService.update(utensil.idUtensil, utensil).pipe(
        switchMap(() => this.utensilService.findAll()),
        tap(data => {
          this.utensilService.setUtensilChange(data);
          this.utensilService.setMessageChange('Utensilio actualizada!');
        })
      );
    } else {
      return this.utensilService.save(utensil).pipe(
        switchMap(() => this.utensilService.findAll()),
        tap(data => {
          this.utensilService.setUtensilChange(data);
          this.utensilService.setMessageChange('Utensilio creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const utensil: Utensil = this.form.value;

    forkJoin([
      this.deleteUtensilByProcedure()
    ]).pipe(
      switchMap(() => this.saveOrUpdateUtensil(utensil)),
    ).subscribe(() => {
      this.navigateToUtensilList();
    });
  }

  navigateToUtensilList() {
    this.router.navigate(['/pages/utensil']);
  }

}

