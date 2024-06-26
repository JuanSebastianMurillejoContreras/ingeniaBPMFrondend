import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, startWith, map, of, forkJoin, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Procedure } from 'src/app/model/Procedure';
import { VariableByProcedure } from 'src/app/model/VariableByProcedure';
import { Variable } from 'src/app/model/variable';
import { ProcedureService } from 'src/app/service/procedure.service';
import { VariableByProcedureService } from 'src/app/service/variable-by-procedure.service';
import { VariableService } from 'src/app/service/variable.service';

@Component({
  selector: 'app-variable-edit',
  standalone: true,
  templateUrl: './variable-edit.component.html',
  styleUrls: ['./variable-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class VariableEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeletevariableByProgramService: number[] = [];
  idsToDeletevariableByVariableService: number[] = [];

  procedure: Procedure[];
  procedureControl: FormControl = new FormControl();
  procedureFiltered$: Observable<Procedure[]>;

  variableByProcedure: VariableByProcedure[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private procedureService: ProcedureService,
    private variableByProcedureService: VariableByProcedureService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idVariable: [0],
      variableName: ['', Validators.required],
      referenceValue: ['', Validators.required],
      expectedValue: ['', Validators.required],
      lstVariableByProcedure: this.fb.array([])
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
      this.variableService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idVariable: data.idVariable,
          variableName: data.variableName,
          referenceValue: data.referenceValue,
          expectedValue: data.expectedValue,
        });
        this.setVariableByProcedure(data.lstVariableByProcedure);
      });
    }
  }

  setVariableByProcedure(s: VariableByProcedure[]) {
    const lsts = this.form.get('lstVariableByProcedure') as FormArray;
    s.forEach(procedure => {
      lsts.push(this.fb.group({
        idVariableByProcedure: [procedure.idVariableByProcedure],
        procedure: [procedure.procedure, Validators.required]
      }));
    });
  }

  get variableByProcedures() {
    return this.form.get('lstVariableByProcedure') as FormArray;
  }

  addVariableByProcedure() {
    this.variableByProcedures.push(this.fb.group({
      idVariableByProcedure: [0],
      procedure: ['', Validators.required]
    }));
  }

  removeVariableByProcedure(index: number) {
    const s = this.variableByProcedures.at(index).value;
    if (s.idVariableByProcedure) {
      this.idsToDeletevariableByVariableService.push(s.idVariableByProcedure);
    }
    this.variableByProcedures.removeAt(index);
  }

  deleteVariableByProcedure(): Observable<any> {
    if (this.idsToDeletevariableByVariableService.length === 0) {
      return of(null);
    }
    const deleteVariableByProcedure$ = this.idsToDeletevariableByVariableService.map(id =>
      this.variableByProcedureService.delete(id)
    );
    return forkJoin(deleteVariableByProcedure$);
  }


  saveOrUpdateVariable(variable: Variable): Observable<any> {
    if (this.isEdit) {
      return this.variableService.update(variable.idVariable, variable).pipe(
        switchMap(() => this.variableService.findAll()),
        tap(data => {
          this.variableService.setVariableChange(data);
          this.variableService.setMessageChange('Variable actualizada!');
        })
      );
    } else {
      return this.variableService.save(variable).pipe(
        switchMap(() => this.variableService.findAll()),
        tap(data => {
          this.variableService.setVariableChange(data);
          this.variableService.setMessageChange('Variable creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const variable: Variable = this.form.value;

    forkJoin([
      this.deleteVariableByProcedure()
    ]).pipe(
      switchMap(() => this.saveOrUpdateVariable(variable)),
    ).subscribe(() => {
      this.navigateToVariableList();
    });
  }

  navigateToVariableList() {
    this.router.navigate(['/pages/variable']);
  }

}

