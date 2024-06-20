import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { GeneralGoal, GeneralGoalByCompanyType, GeneralGoalByProgram, SpecificGoal } from 'src/app/model/generalGoal';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { ProgramService } from 'src/app/service/program.service';
import { SpecificGoalService } from 'src/app/service/specific-goal.service';
import { GeneralGoalByCompanyTypeService } from 'src/app/service/generalgoalbycompanytype.service';
import { GeneralGoalByProgramService } from 'src/app/service/generalgoalbyprogram.service';
import { generalGoalByCompanyType } from 'src/app/model/generalGoalByCompanyType';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-general-goal-edit',
  standalone: true,
  templateUrl: './general-goal-edit.component.html',
  styleUrls: ['./general-goal-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet, MatCardModule]

}) export class GeneralGoalEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  idsToDeleteSpecificGoal: number[] = [];
  idsToDeleteGeneralGoalByProgramService: number[] = [];
  idsToDeleteGeneralGoalByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  generalGoalByProgram: GeneralGoalByProgram[];

  generalGoalByCompanyType: GeneralGoalByCompanyType[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private generalGoalService: GeneralGoalService,
    private specificGoalService: SpecificGoalService,
    private generalGoalByProgramService: GeneralGoalByProgramService,
    private generalGoalByCompanyTypeService: GeneralGoalByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService
  ) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      idGeneralGoal: [0],
      generalGoal: ['', Validators.required],
      lstSpecificGoal: this.fb.array([]),
      lstGeneralGoalByProgram: this.fb.array([]),
      lstGeneralGoalByCompanyType: this.fb.array([])
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
      this.generalGoalService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idGeneralGoal: data.idGeneralGoal,
          generalGoal: data.generalGoal,
        });
        this.setSpecificGoals(data.lstSpecificGoal);
        this.setGeneralGoalByProgram(data.lstGeneralGoalByProgram);
        this.setGeneralGoalByCompanyType(data.lstGeneralGoalByCompanyType);
      });
    }
  }

  setSpecificGoals(specificGoal: SpecificGoal[]) {
    const lstSpecificGoal = this.form.get('lstSpecificGoal') as FormArray;
    specificGoal.forEach(specificGoal => {
      lstSpecificGoal.push(this.fb.group({
        idSpecificGoal: [specificGoal.idSpecificGoal],
        specificGoal: [specificGoal.specificGoal, Validators.required]
      }));
    });
  }

  setGeneralGoalByProgram(generalGoalByProgram: GeneralGoalByProgram[]) {
    const lstGeneralGoalByProgram = this.form.get('lstGeneralGoalByProgram') as FormArray;
    generalGoalByProgram.forEach(generalGoalByProgram => {
      lstGeneralGoalByProgram.push(this.fb.group({
        idGeneralGoalByProgram: [generalGoalByProgram.idGeneralGoalByProgram],
        program: [generalGoalByProgram.program, Validators.required]
      }));
    });
  }

  setGeneralGoalByCompanyType(generalGoalByCompanyType: generalGoalByCompanyType[]) {
    const lstGeneralGoalByProgram = this.form.get('lstGeneralGoalByCompanyType') as FormArray;
    generalGoalByCompanyType.forEach(generalGoalByCompanyType => {
      lstGeneralGoalByProgram.push(this.fb.group({
        idGeneralGoalByCompanyType: [generalGoalByCompanyType.idGeneralGoalByCompanyType],
        companyType: [generalGoalByCompanyType.companyType, Validators.required]
      }));
    });
  }


  get specificGoals() {
    return this.form.get('lstSpecificGoal') as FormArray;
  }

  get generalGoalByPrograms() {
    return this.form.get('lstGeneralGoalByProgram') as FormArray;
  }

  get generalGoalByCompanyTypes() {
    return this.form.get('lstGeneralGoalByCompanyType') as FormArray;
  }


  addSpecificGoal() {
    this.specificGoals.push(this.fb.group({
      idSpecificGoal: [0],
      specificGoal: ['', Validators.required]
    }));
  }

  addgeneralGoalByProgram() {
    this.generalGoalByPrograms.push(this.fb.group({
      idGeneralGoalByProgram: [0],
      program: ['', Validators.required]
    }));
    
  }

  addgeneralGoalByCompanyType() {
    this.generalGoalByCompanyTypes.push(this.fb.group({
      idGeneralGoalByCompanyType: [0],
      companyType: ['', Validators.required]
    }));
  }

  removeSpecificGoal(index: number) {
    const goal = this.specificGoals.at(index).value;
    if (goal.idSpecificGoal) {
      this.idsToDeleteSpecificGoal.push(goal.idSpecificGoal);
    }
    this.specificGoals.removeAt(index);
  }


  removeGeneralGoalByProgram(index: number) {
    const generalGoalByProgram = this.generalGoalByPrograms.at(index).value;
    if (generalGoalByProgram.idGeneralGoalByProgram) {
      this.idsToDeleteGeneralGoalByProgramService.push(generalGoalByProgram.idGeneralGoalByProgram);
    }
    this.generalGoalByPrograms.removeAt(index);
  }

  removeGeneralGoalByCompanyType(index: number) {
    const generalGoalByCompanyType = this.generalGoalByCompanyTypes.at(index).value;
    if (generalGoalByCompanyType.idGeneralGoalByCompanyType) {
      this.idsToDeleteGeneralGoalByCompanyTypeService.push(generalGoalByCompanyType.idGeneralGoalByCompanyType);
    }
    this.generalGoalByCompanyTypes.removeAt(index);
  }

  deleteSpecificGoals(): Observable<any> {
    if (this.idsToDeleteSpecificGoal.length === 0) {
      return of(null);
    }
    const deleteSpecificGoals$ = this.idsToDeleteSpecificGoal.map(id =>
      this.specificGoalService.delete(id)
    );
    return forkJoin(deleteSpecificGoals$);
  }

  deleteGeneralGoalByProgram(): Observable<any> {
    if (this.idsToDeleteGeneralGoalByProgramService.length === 0) {
      return of(null);
    }
    const deleteGeneralGoalByProgram$ = this.idsToDeleteGeneralGoalByProgramService.map(id =>
      this.generalGoalByProgramService.delete(id)
    );
    return forkJoin(deleteGeneralGoalByProgram$);
  }

  deleteGeneralGoalByCompanyType(): Observable<any> {
    if (this.idsToDeleteGeneralGoalByCompanyTypeService.length === 0) {
      return of(null);
    }
    const deleteGeneralGoalByCompanyType$ = this.idsToDeleteGeneralGoalByCompanyTypeService.map(id =>
      this.generalGoalByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteGeneralGoalByCompanyType$);
  }

  saveOrUpdateGeneralGoal(generalGoal: GeneralGoal): Observable<any> {
    if (this.isEdit) {
      return this.generalGoalService.update(generalGoal.idGeneralGoal, generalGoal).pipe(
        switchMap(() => this.generalGoalService.findAll()),
        tap(data => {
          this.generalGoalService.setGeneralGoalChange(data);
          this.generalGoalService.setMessageChange('Objetivos actualizados!');
        })
      );
    } else {
      return this.generalGoalService.save(generalGoal).pipe(
        switchMap(() => this.generalGoalService.findAll()),
        tap(data => {
          this.generalGoalService.setGeneralGoalChange(data);
          this.generalGoalService.setMessageChange('Objetivos creados!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const generalGoal: GeneralGoal = this.form.value;

    forkJoin([
      this.deleteSpecificGoals(),
      this.deleteGeneralGoalByProgram(),
      this.deleteGeneralGoalByCompanyType()
    ]).pipe(
      switchMap(() => this.saveOrUpdateGeneralGoal(generalGoal)),
    ).subscribe(() => {
      this.navigateToGeneralGoalList();
    });
  }




  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/generalgoal']);
  }

}