import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, startWith, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Procedure } from 'src/app/model/Procedure';
import { ProcedureExecution } from 'src/app/model/ProcedureExecution';
import { ProcedureExecutionService } from 'src/app/service/procedure-execution.service';
import { ProcedureService } from 'src/app/service/procedure.service';

@Component({
  selector: 'app-procedureexecution-edit',
  standalone: true,
  templateUrl: './procedureexecution-edit.component.html',
  styleUrls: ['./procedureexecution-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class ProcedureexecutionEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  procedure: Procedure[];
  procedureControl: FormControl = new FormControl();
  procedureFiltered$: Observable<Procedure[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private procedureExecutionService: ProcedureExecutionService
  ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      'idProcedureExecution': new FormControl(0),
      'procedure': this.procedureControl,
      'executionDescription': new FormControl('', [Validators.required]),
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
    // Si el valor es '*', retornar todos los procedimientos
    if (val === '*') {
      return this.procedure;
    }

    // Si no es '*', aplicar el filtro normal
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
      this.procedureExecutionService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idProcedureExecution': data.idProcedureExecution,
          'procedure': data.procedure,
          'executionDescription': data.executionDescription,
        });
      });
    }
  }


  operate() {
    if (this.form.invalid) { return; }

    let procedureexecution = new ProcedureExecution();
    procedureexecution.idProcedureExecution = this.form.value['idProcedureExecution'];
    procedureexecution.procedure = this.form.value['procedure'];
    procedureexecution.executionDescription = this.form.value['executionDescription'];


    if (this.isEdit) {
      this.procedureExecutionService.update(procedureexecution.idProcedureExecution, procedureexecution).pipe(switchMap(() => {
        return this.procedureExecutionService.findAll();
      }))
        .subscribe(data => {
          this.procedureExecutionService.setProcedureExecutionChange(data);
          this.procedureExecutionService.setMessageChange('Compañía actualizada!')

        });
    } else {
      this.procedureExecutionService.save(procedureexecution).pipe(switchMap(() => {
        return this.procedureExecutionService.findAll();
      }))
        .subscribe(data => {
          this.procedureExecutionService.setProcedureExecutionChange(data);
          this.procedureExecutionService.setMessageChange("Compañia creada!")
        });
    }
    this.router.navigate(['/pages/procedureexecution']);
  }


}






