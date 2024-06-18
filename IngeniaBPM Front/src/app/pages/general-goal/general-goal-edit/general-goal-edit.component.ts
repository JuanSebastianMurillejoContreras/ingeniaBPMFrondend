import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'; // Importar las clases necesarias
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { GeneralGoal, SpecificGoal } from 'src/app/model/generalGoal';
import { GeneralGoalByProgramByCompanyType } from 'src/app/model/generalGoalByProgramByCompanyType';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { GeneralGoalByProgramByCompanyTypeService } from 'src/app/service/general-goal-by-program-by-company-type.service';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { ProgramService } from 'src/app/service/program.service';
import { SpecificGoalService } from 'src/app/service/specific-goal.service';

@Component({
  selector: 'app-general-goal-edit',
  standalone: true,
  templateUrl: './general-goal-edit.component.html',
  styleUrls: ['./general-goal-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet, CdkDropListGroup, CdkDropList, CdkDrag]

}) export class GeneralGoalEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  idsToDeleteSpecificGoal: number[] = [];
  idsToDeleteGeneralGoalByProgramByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;


  generalGoalByProgramByCompanyType: GeneralGoalByProgramByCompanyType[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private generalGoalService: GeneralGoalService,
    private specificGoalService: SpecificGoalService,
    private generalGoalByProgramByCompanyTypeService: GeneralGoalByProgramByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idGeneralGoal: [0],
      generalGoal: ['', Validators.required],
      lstSpecificGoal: this.fb.array([]),
      lstGeneralGoalByProgramByCompanyType: this.fb.array([])
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

   dropProgram(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

 
  dropCompanyType(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  dropGeneralGoalByProgramByCompanyType(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );console.log(  event.previousContainer.data)
    }
    this.updateFormArray();
  }

    setGeneralGoalByProgramByCompanyType(generalGoalByProgramByCompanyType: GeneralGoalByProgramByCompanyType[]) {
    const lstGeneralGoalByProgramByCompanyType = this.form.get('lstGeneralGoalByProgramByCompanyType') as FormArray;

    generalGoalByProgramByCompanyType.forEach(programByCompany => {
      lstGeneralGoalByProgramByCompanyType.push(this.fb.group({
        idGeneralGoalByProgramByCompanyType: [programByCompany.idGeneralGoalByProgramByCompanyType],
        program: [programByCompany.program, Validators.required],
        companyType: [programByCompany.companyType, Validators.required]
      }));
      //console.log(programByCompany)
    });
  }


  updateFormArray() {
    const lstGeneralGoalByProgramByCompanyType = this.form.get('lstGeneralGoalByProgramByCompanyType') as FormArray;
    lstGeneralGoalByProgramByCompanyType.clear();

    this.program.forEach((program, index) => {
      if (this.companyType[index]) {
        lstGeneralGoalByProgramByCompanyType.push(this.fb.group({
          idGeneralGoalByProgramByCompanyType: [0],
          program: [program.name, Validators.required],
          companyType: [this.companyType[index].nameCompanyType, Validators.required]
        }));
      }
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
    this.generalGoalByProgramByCompanyTypeService.findAll().subscribe(data => this.generalGoalByProgramByCompanyType = data);
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
        this.setGeneralGoalByProgramByCompanyType(data.lstGeneralGoalByProgramByCompanyType);
      });
    }
  }

  setSpecificGoals(specificGoal: SpecificGoal[]) {
    const lstSpecificGoal = this.form.get('lstSpecificGoal') as FormArray;
    specificGoal.forEach(specific => {
      lstSpecificGoal.push(this.fb.group({
        idSpecificGoal: [specific.idSpecificGoal],
        specificGoal: [specific.specificGoal, Validators.required]
      }));
    });
  }



  get specificGoals() {
    return this.form.get('lstSpecificGoal') as FormArray;
  }

  get generalGoalByProgramByCompanyTypes() {
    return this.form.get('lstGeneralGoalByProgramByCompanyType') as FormArray;
  }


  addSpecificGoal() {
    this.specificGoals.push(this.fb.group({
      idSpecificGoal: [0],
      specificGoal: ['', Validators.required]
    }));
  }

  addgeneralGoalByProgramByCompanyType() {
    this.generalGoalByProgramByCompanyTypes.push(this.fb.group({
      idGeneralGoalByProgramByCompanyType: [0],
      program: ['', Validators.required],
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


  removeGeneralGoalByProgramByCompanyType(index: number) {
    const generalGoalByProgramByCompanyType = this.generalGoalByProgramByCompanyTypes.at(index).value;
    if (generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType) {
      this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.push(generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType);
    }
    this.generalGoalByProgramByCompanyTypes.removeAt(index);
  }


operate() {
    if (this.form.invalid) {
      return;
    }

    const generalGoal: GeneralGoal = this.form.value;

    forkJoin([
      this.deleteSpecificGoals(),
      this.deleteGeneralGoalByProgramByCompanyType()
    ]).pipe(
      switchMap(() => this.saveOrUpdateGeneralGoal(generalGoal)),
      catchError(error => {
        console.error('Error during delete operations', error);
        return of(null); // Continue even if delete operations fail
      })
    ).subscribe(() => {
      this.navigateToGeneralGoalList();
    });
  }

  deleteSpecificGoals(): Observable<any> {
    if (this.idsToDeleteSpecificGoal.length === 0) {
      return of(null); // No specific goals to delete
    }
    const deleteSpecificGoals$ = this.idsToDeleteSpecificGoal.map(id =>
      this.specificGoalService.delete(id)
    );
    return forkJoin(deleteSpecificGoals$);
  }

  deleteGeneralGoalByProgramByCompanyType(): Observable<any> {
    if (this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.length === 0) {
      return of(null); // No general goals by program and company type to delete
    }
    const deleteGeneralGoalByProgramByCompanyType$ = this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.map(id =>
      this.generalGoalByProgramByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteGeneralGoalByProgramByCompanyType$);
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

  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/generalgoal']);
  }

  addIdToDeleteSpecificGoal(id: number) {
    if (!this.idsToDeleteSpecificGoal.includes(id)) {
      this.idsToDeleteSpecificGoal.push(id);
    }
  }

  removeIdToDeleteSpecificGoal(index: number) {
    this.idsToDeleteSpecificGoal.splice(index, 1);
  }

  addIdToDeleteGeneralGoal(id: number) {
    if (!this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.includes(id)) {
      this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.push(id);
    }
  }

  removeIdToDeleteGeneralGoal(index: number) {
    this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.splice(index, 1);
  }
  

}