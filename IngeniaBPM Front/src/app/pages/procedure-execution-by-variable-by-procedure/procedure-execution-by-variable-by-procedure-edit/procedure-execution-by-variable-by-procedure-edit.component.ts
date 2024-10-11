import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { ProcedureExecutionByVariableByProcedure } from 'src/app/model/ProcedureExecutionByVariableByProcedure';
import { VariableByProcedure } from 'src/app/model/variable';
import { ProcedureExecutionByVariableByProcedureService } from 'src/app/service/procedure-execution-by-variable-by-procedure.service';
import { ProcedureExecutionService } from 'src/app/service/procedure-execution.service';
import { VariableByProcedureService } from 'src/app/service/variable-by-procedure.service';

@Component({
  selector: 'app-procedure-execution-by-variable-by-procedure-edit',
  standalone: true,
  templateUrl: './procedure-execution-by-variable-by-procedure-edit.component.html',
  styleUrls: ['./procedure-execution-by-variable-by-procedure-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class ProcedureExecutionByVariableByProcedureEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  procedureExecutionByVariableByProcedure: ProcedureExecutionByVariableByProcedure[];
  procedureExecutionByVariableByProcedureControl: FormControl = new FormControl();
  procedureExecutionByVariableByProcedureFiltered$: Observable<ProcedureExecutionByVariableByProcedure[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private procedureExecutionByVariableByProcedureService: ProcedureExecutionByVariableByProcedureService,
    private variableByProcedureService: VariableByProcedureService
  ) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      idProcedureExecutionByVariableByProcedure: [0],
      procedureExecution: ['', Validators.required],
      variableByProcedure: ['', Validators.required],
      registeredValue: ['', Validators.required],
    });

    this.loadInitialData();
    this.procedureExecutionByVariableByProcedureFiltered$ = this.procedureExecutionByVariableByProcedureControl.valueChanges.pipe(startWith(''), map(val => this.filterVariableByProcedure(val)));


    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;
      this.initForm();
    });
  }

  loadInitialData() {
    this.procedureExecutionByVariableByProcedureService.findAll().subscribe(data => this.procedureExecutionByVariableByProcedure = data);
  }

  filterVariableByProcedure(val: any): ProcedureExecutionByVariableByProcedure[] {
    if (!val || typeof val !== 'string') {
      return [];
    }
    // Si el valor es '*', retornar todos los procedimientos
    if (val === '*') {
      return this.procedureExecutionByVariableByProcedure;
    }

    // Si no es '*', aplicar el filtro normal
    return this.procedureExecutionByVariableByProcedure.filter(el =>
      el.variableByProcedure.variable.variableName.toLowerCase().includes(val.toLowerCase())
    );
  }

  

  showProcedureExecutionByVariableByProcedure(val: any) {
    return val ? `${val.name}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.procedureExecutionByVariableByProcedureService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idProcedureExecutionByVariableByProcedure': data.idProcedureExecutionByVariableByProcedure,
          'procedureExecution': data.procedureExecution,
          'variableByProcedure': data.variableByProcedure,
          'registeredValue': data.registeredValue
        });
      });
    }
  }


  operate() {
    if (this.form.invalid) { return; }

    let pocedureExecutionByVariableByProcedure = new ProcedureExecutionByVariableByProcedure();
    pocedureExecutionByVariableByProcedure.idProcedureExecutionByVariableByProcedure = this.form.value['idProcedureExecutionByVariableByProcedure'];
    pocedureExecutionByVariableByProcedure.procedureExecution = this.form.value['procedureExecution'];
    pocedureExecutionByVariableByProcedure.variableByProcedure = this.form.value['variableByProcedure'];
    pocedureExecutionByVariableByProcedure.registeredValue = this.form.value['registeredValue'];


    if (this.isEdit) {
      this.procedureExecutionByVariableByProcedureService.update(pocedureExecutionByVariableByProcedure.idProcedureExecutionByVariableByProcedure, pocedureExecutionByVariableByProcedure).pipe(switchMap(() => {
        return this.procedureExecutionByVariableByProcedureService.findAll();
      }))
        .subscribe(data => {
          this.procedureExecutionByVariableByProcedureService.setProcedureExecutionByVariableByProcedureChange(data);
          this.procedureExecutionByVariableByProcedureService.setMessageChange('Variable actualizada!')

        });
    } else {
      this.procedureExecutionByVariableByProcedureService.save(pocedureExecutionByVariableByProcedure).pipe(switchMap(() => {
        return this.procedureExecutionByVariableByProcedureService.findAll();
      }))
        .subscribe(data => {
          this.procedureExecutionByVariableByProcedureService.setProcedureExecutionByVariableByProcedureChange(data);
          this.procedureExecutionByVariableByProcedureService.setMessageChange("Variable agregada al procedimiento!")
        });
    }
    this.router.navigate(['/pages/procedureexecution']);
  }


}




