import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { ProcedureByCompanyType } from 'src/app/model/ProcedureByCompanyType';
import { CompanyType } from 'src/app/model/companyType';
import { GeneralGoalByCompanyType } from 'src/app/model/generalGoal';
import { Procedure, ProcedureByProgram } from 'src/app/model/Procedure';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { ProcedureService } from 'src/app/service/procedure.service';
import { ProcedureByCompanyTypeService } from 'src/app/service/procedurebycompanytype.service';
import { ProcedureByProgramService } from 'src/app/service/procedurebyprogram.service';
import { ProgramService } from 'src/app/service/program.service';

@Component({
  standalone: true,
  selector: 'app-procedure-edit',
  templateUrl: './procedure-edit.component.html',
  styleUrls: ['./procedure-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class ProcedureEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeleteprocedureByProgramService: number[] = [];
  idsToDeleteprocedureByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  procedureByProgram: ProcedureByProgram[];

  generalGoalByCompanyType: GeneralGoalByCompanyType[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private procedureByProgramService: ProcedureByProgramService,
    private procedureByCompanyTypeService: ProcedureByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idProcedure: [0],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      frequency: ['', Validators.required],
      observations: ['', Validators.required],
      responsible: ['', Validators.required],      
      lstProcedureByProgram: this.fb.array([]),
      lstProcedureByCompanyType: this.fb.array([])

    });

    this.loadInitialData();
    this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe(startWith(''), map(val => this.filterCompanyType(val)));
    this.programFiltered$ = this.programControl.valueChanges.pipe(startWith(''), map(val => this.filterProgram(val)));

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;
      this.initForm();
    });
  }


  filterProgram(val: any): Program[] {
    if (!val || typeof val !== 'string') {
      return [];
    }
    return this.program.filter(el =>
      el.name.toLowerCase().includes(val.toLowerCase())
    );
  }

  filterCompanyType(val: any): CompanyType[] {
    if (!val || typeof val !== 'string') {
      return [];
    }
    return this.companyType.filter(el =>
      el.nameCompanyType.toLowerCase().includes(val.toLowerCase())
    );
  }


  loadInitialData() {
    this.programService.findAll().subscribe(data => this.program = data);
    this.companyTypeService.findAll().subscribe(data => this.companyType = data);
  }

  showProgram(val: any) {
    return val ? `${val.name}` : val;
  }

  showCompanyType(val: any) {
    return val ? `${val.nameCompanyType}` : val;
  }

  initForm() {
    if (this.isEdit) {
      this.procedureService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idProcedure: data.idProcedure,
          code: data.code,
          name: data.name,
          description: data.description,
          frequency: data.frequency,
          observations: data.observations,
          responsible:data.responsible
        });
        this.setProcedureByProgram(data.lstProcedureByProgram);
        this.setProcedureByCompanyType(data.lstProcedureByCompanyType);
      });
    }
  }

  setProcedureByProgram(procedureByProgram: ProcedureByProgram[]) {
    const lstprocedureByProgram = this.form.get('lstProcedureByProgram') as FormArray;
    procedureByProgram.forEach(procedureByProgram => {
      lstprocedureByProgram.push(this.fb.group({
        idProcedureByProgram: [procedureByProgram.idProcedureByProgram],
        program: [procedureByProgram.program, Validators.required]
      }));
    });
  }

  setProcedureByCompanyType(procedureByCompanyType: ProcedureByCompanyType[]) {
    const lstprocedureByCompanyType = this.form.get('lstProcedureByCompanyType') as FormArray;
    procedureByCompanyType.forEach(procedureByCompanyType => {
      lstprocedureByCompanyType.push(this.fb.group({
        idProcedureByCompanyType: [procedureByCompanyType.idProcedureByCompanyType],
        companyType: [procedureByCompanyType.companyType, Validators.required]
      }));
    });
  }

  get procedureByPrograms() {
    return this.form.get('lstProcedureByProgram') as FormArray;
  }

  get procedureByCompanyTypes() {
    return this.form.get('lstProcedureByCompanyType') as FormArray;
  }

  addProcedureByProgram() {
    this.procedureByPrograms.push(this.fb.group({
      idProcedureByProgram: [0],
      program: ['', Validators.required]
    }));
    
  }

  addProcedureByCompanyType() {
    this.procedureByCompanyTypes.push(this.fb.group({
      idProcedureByCompanyType: [0],
      companyType: ['', Validators.required]
    }));
  }

  removeProcedureByProgram(index: number) {
    const procedureByProgram = this.procedureByPrograms.at(index).value;
    if (procedureByProgram.idProcedureByProgram) {
      this.idsToDeleteprocedureByProgramService.push(procedureByProgram.idProcedureByProgram);
    }
    this.procedureByPrograms.removeAt(index);
  }

  removeProcedureByCompanyType(index: number) {
    const procedureByCompanyType = this.procedureByCompanyTypes.at(index).value;
    if (procedureByCompanyType.idProcedureByCompanyType) {
      this.idsToDeleteprocedureByCompanyTypeService.push(procedureByCompanyType.idProcedureByCompanyType);
    }
    this.procedureByCompanyTypes.removeAt(index);
  }

  deleteProcedureByProgram(): Observable<any> {
    if (this.idsToDeleteprocedureByProgramService.length === 0) {
      return of(null);
    }
    const deleteprocedureByProgram$ = this.idsToDeleteprocedureByProgramService.map(id =>
      this.procedureByProgramService.delete(id)
    );
    return forkJoin(deleteprocedureByProgram$);
  }

  deleteProcedureByCompanyType(): Observable<any> {
    if (this.idsToDeleteprocedureByCompanyTypeService.length === 0) {
      return of(null);
    }
    const deleteProcedureByCompanyType$ = this.idsToDeleteprocedureByCompanyTypeService.map(id =>
      this.procedureByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteProcedureByCompanyType$);
  }


  saveOrUpdateGeneralGoal(procedure: Procedure): Observable<any> {
    if (this.isEdit) {
      return this.procedureService.update(procedure.idProcedure, procedure).pipe(
        switchMap(() => this.procedureService.findAll()),
        tap(data => {
          this.procedureService.setProcedureChange(data);
          this.procedureService.setMessageChange('Glosario actualizado!');
        })
      );
    } else {
      return this.procedureService.save(procedure).pipe(
        switchMap(() => this.procedureService.findAll()),
        tap(data => {
          this.procedureService.setProcedureChange(data);
          this.procedureService.setMessageChange('Glosario creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const procedure: Procedure = this.form.value;

    forkJoin([
      this.deleteProcedureByCompanyType(),
      this.deleteProcedureByProgram()
    ]).pipe(
      switchMap(() => this.saveOrUpdateGeneralGoal(procedure)),
    ).subscribe(() => {
      this.navigateToGeneralGoalList();
    });
  }

  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/procedure']);
  }

}
