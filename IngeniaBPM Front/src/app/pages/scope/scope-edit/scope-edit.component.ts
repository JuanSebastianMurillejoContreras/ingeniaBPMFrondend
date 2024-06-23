import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { Program } from 'src/app/model/program';
import { Scope, ScopeByCompanyType, ScopeByProgram } from 'src/app/model/scope';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { ProgramService } from 'src/app/service/program.service';
import { ScopeService } from 'src/app/service/scope.service';
import { ScopeByCompanyTypeService } from 'src/app/service/scopebycompanytype.service';
import { ScopeByProgramService } from 'src/app/service/scopebyprogram.service';

@Component({
  selector: 'app-scope-edit',
  standalone: true,
  templateUrl: './scope-edit.component.html',
  styleUrls: ['./scope-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class ScopeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeletescopeByProgramService: number[] = [];
  idsToDeletescopeByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  scopeByProgram: ScopeByProgram[];

  scopeByCompanyType: ScopeByCompanyType[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scopeService: ScopeService,
    private scopeByProgramService: ScopeByProgramService,
    private scopeByCompanyTypeService: ScopeByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idScope: [0],
      definitionScope: ['', Validators.required],
      lstScopeByProgram: this.fb.array([]),
      lstScopeByCompanyType: this.fb.array([])
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
      this.scopeService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idScope: data.idScope,
          definitionScope: data.definitionScope,
        });
        this.setScopeByProgram(data.lstScopeByProgram);
        this.setScopeByCompanyType(data.lstScopeByCompanyType);
      });
    }
  }

  setScopeByProgram(scopeByProgram: ScopeByProgram[]) {
    const lstscopeByProgram = this.form.get('lstScopeByProgram') as FormArray;
    scopeByProgram.forEach(scopeByProgram => {
      lstscopeByProgram.push(this.fb.group({
        idScopeByProgram: [scopeByProgram.idScopeByProgram],
        program: [scopeByProgram.program, Validators.required]
      }));
    });
  }

  setScopeByCompanyType(scopeByCompanyType: ScopeByCompanyType[]) {
    const lstscopeByCompanyType = this.form.get('lstScopeByCompanyType') as FormArray;
    scopeByCompanyType.forEach(scopeByCompanyType => {
      lstscopeByCompanyType.push(this.fb.group({
        idScopeByCompanyType: [scopeByCompanyType.idScopeByCompanyType],
        companyType: [scopeByCompanyType.companyType, Validators.required]
      }));
    });
  }

  get scopeByPrograms() {
    return this.form.get('lstScopeByProgram') as FormArray;
  }

  get scopeByCompanyTypes() {
    return this.form.get('lstScopeByCompanyType') as FormArray;
  }

  addScopeByProgram() {
    this.scopeByPrograms.push(this.fb.group({
      idScopeByProgram: [0],
      program: ['', Validators.required]
    }));
    
  }

  addScopeByCompanyType() {
    this.scopeByCompanyTypes.push(this.fb.group({
      idScopeByCompanyType: [0],
      companyType: ['', Validators.required]
    }));
  }

  removeScopeByProgram(index: number) {
    const scopeByProgram = this.scopeByPrograms.at(index).value;
    if (scopeByProgram.idScopeByProgram) {
      this.idsToDeletescopeByProgramService.push(scopeByProgram.idScopeByProgram);
    }
    this.scopeByPrograms.removeAt(index);
  }

  removeScopeByCompanyType(index: number) {
    const scopeByCompanyType = this.scopeByCompanyTypes.at(index).value;
    if (scopeByCompanyType.idScopeByCompanyType) {
      this.idsToDeletescopeByCompanyTypeService.push(scopeByCompanyType.idScopeByCompanyType);
    }
    this.scopeByCompanyTypes.removeAt(index);
  }

  deleteScopeByProgram(): Observable<any> {
    if (this.idsToDeletescopeByProgramService.length === 0) {
      return of(null);
    }
    const deletescopeByProgram$ = this.idsToDeletescopeByProgramService.map(id =>
      this.scopeByProgramService.delete(id)
    );
    return forkJoin(deletescopeByProgram$);
  }

  deleteScopeByCompanyType(): Observable<any> {
    if (this.idsToDeletescopeByCompanyTypeService.length === 0) {
      return of(null);
    }
    const deleteScopeByCompanyType$ = this.idsToDeletescopeByCompanyTypeService.map(id =>
      this.scopeByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteScopeByCompanyType$);
  }


  saveOrUpdateGeneralGoal(scope: Scope): Observable<any> {
    if (this.isEdit) {
      return this.scopeService.update(scope.idScope, scope).pipe(
        switchMap(() => this.scopeService.findAll()),
        tap(data => {
          this.scopeService.setScopeChange(data);
          this.scopeService.setMessageChange('Alcance actualizado!');
        })
      );
    } else {
      return this.scopeService.save(scope).pipe(
        switchMap(() => this.scopeService.findAll()),
        tap(data => {
          this.scopeService.setScopeChange(data);
          this.scopeService.setMessageChange('Alcance creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const scope: Scope = this.form.value;

    forkJoin([
      this.deleteScopeByCompanyType(),
      this.deleteScopeByProgram()
    ]).pipe(
      switchMap(() => this.saveOrUpdateGeneralGoal(scope)),
    ).subscribe(() => {
      this.navigateToGeneralGoalList();
    });
  }

  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/scope']);
  }

}
