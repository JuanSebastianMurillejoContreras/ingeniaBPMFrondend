import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, startWith, map, of, forkJoin, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Procedure } from 'src/app/model/Procedure';
import { Supplies } from 'src/app/model/Supplies';
import { SuppliesByProcedure } from 'src/app/model/SuppliesByProcedure';

import { ProcedureService } from 'src/app/service/procedure.service';
import { SuppliesByProcedureService } from 'src/app/service/supplies-by-procedure.service';
import { SuppliesService } from 'src/app/service/supplies.service';

@Component({
  selector: 'app-supplies-edit',
  standalone: true,
  templateUrl: './supplies-edit.component.html',
  styleUrls: ['./supplies-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class SuppliesEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeletesuppliesByProgramService: number[] = [];
  idsToDeletesuppliesBySuppliesService: number[] = [];

  procedure: Procedure[];
  procedureControl: FormControl = new FormControl();
  procedureFiltered$: Observable<Procedure[]>;

  suppliesByProcedure: SuppliesByProcedure[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private suppliesService: SuppliesService,
    private procedureService: ProcedureService,
    private suppliesByProcedureService: SuppliesByProcedureService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idSupplies: [0],
      suppliesName: ['', Validators.required],
      lstSuppliesByProcedure: this.fb.array([])
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
      this.suppliesService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idSupplies: data.idSupplies,
          suppliesName: data.suppliesName
        });
        this.setSuppliesByProcedure(data.lstSuppliesByProcedure);
      });
    }
  }

  setSuppliesByProcedure(s: SuppliesByProcedure[]) {
    const lsts = this.form.get('lstSuppliesByProcedure') as FormArray;
    s.forEach(procedure => {
      lsts.push(this.fb.group({
        idSuppliesByProcedure: [procedure.idSuppliesByProcedure],
        procedure: [procedure.procedure, Validators.required]
      }));
    });
  }

  get suppliesByProcedures() {
    return this.form.get('lstSuppliesByProcedure') as FormArray;
  }

  addSuppliesByProcedure() {
    this.suppliesByProcedures.push(this.fb.group({
      idSuppliesByProcedure: [0],
      procedure: ['', Validators.required]
    }));
  }

  removeSuppliesByProcedure(index: number) {
    const s = this.suppliesByProcedures.at(index).value;
    if (s.idSuppliesByProcedure) {
      this.idsToDeletesuppliesBySuppliesService.push(s.idSuppliesByProcedure);
    }
    this.suppliesByProcedures.removeAt(index);
  }

  deleteSuppliesByProcedure(): Observable<any> {
    if (this.idsToDeletesuppliesBySuppliesService.length === 0) {
      return of(null);
    }
    const deleteSuppliesByProcedure$ = this.idsToDeletesuppliesBySuppliesService.map(id =>
      this.suppliesByProcedureService.delete(id)
    );
    return forkJoin(deleteSuppliesByProcedure$);
  }


  saveOrUpdateSupplies(supplies: Supplies): Observable<any> {
    if (this.isEdit) {
      return this.suppliesService.update(supplies.idSupplies, supplies).pipe(
        switchMap(() => this.suppliesService.findAll()),
        tap(data => {
          this.suppliesService.setSuppliesChange(data);
          this.suppliesService.setMessageChange('Supplies actualizada!');
        })
      );
    } else {
      return this.suppliesService.save(supplies).pipe(
        switchMap(() => this.suppliesService.findAll()),
        tap(data => {
          this.suppliesService.setSuppliesChange(data);
          this.suppliesService.setMessageChange('Supplies creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const supplies: Supplies = this.form.value;

    forkJoin([
      this.deleteSuppliesByProcedure()
    ]).pipe(
      switchMap(() => this.saveOrUpdateSupplies(supplies)),
    ).subscribe(() => {
      this.navigateToSuppliesList();
    });
  }

  navigateToSuppliesList() {
    this.router.navigate(['/pages/supplies']);
  }

}

