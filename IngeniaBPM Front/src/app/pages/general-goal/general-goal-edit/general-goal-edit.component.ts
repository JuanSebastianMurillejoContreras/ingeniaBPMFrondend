import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})export class GeneralGoalEditComponent implements OnInit {
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

    this.loadInitialData()

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

  filterCompanyType( val: any ): CompanyType[] {
    if ( !val ) {
      return this.companyType;
    }

    if ( val?.idCompanyType > 0 ) {
      return this.companyType.filter( el =>
        el.nameCompanyType.toLowerCase().includes( val.nameCompanyType.toLowerCase() ) );
    } else {
      return this.companyType.filter( el =>
        el.nameCompanyType.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }


  loadInitialData() {
    this.programService.findAll().subscribe( data => this.program = data );
    this.companyTypeService.findAll().subscribe( data => this.companyType = data );
  }
  
  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  
  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.generalGoalService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idGeneralGoal: data.idGeneralGoal,
          generalGoal: data.generalGoal
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

  setGeneralGoalByProgramByCompanyType(generalGoalByProgramByCompanyType: GeneralGoalByProgramByCompanyType[]) {
    const controlArray = this.form.get('lstGeneralGoalByProgramByCompanyType') as FormArray;
    generalGoalByProgramByCompanyType.forEach(item => {
        controlArray.push(this.fb.group({
            idGeneralGoalByProgramByCompanyType: [item.idGeneralGoalByProgramByCompanyType],
            program: [item.program, Validators.required],
            companyType: [item.companyType, Validators.required]
        }));
    });
}

  get specificGoals() {
    return this.form.get('lstSpecificGoal') as FormArray;
  }

  get generalGoalByProgramByCompanyType() {
    return this.form.get('lstGeneralGoalByProgramByCompanyType') as FormArray;
  }


  addSpecificGoal() {
    this.specificGoals.push(this.fb.group({
      idSpecificGoal: [0],
      specificGoal: ['', Validators.required]
    }));
  }

  addgeneralGoalByProgramByCompanyType() {
    this.generalGoalByProgramByCompanyType.push(this.fb.group({
      idGeneralGoalByProgramByCompanyType: [0],
      program: [Validators.required],
      companyType: [Validators.required]
    }));
  }

  removeSpecificGoal(index: number) {
    const goal = this.specificGoals.at(index).value;
    if (goal.idSpecificGoal) {
      this.idsToDeleteSpecificGoal.push(goal.idSpecificGoal); 
    }
    this.specificGoals.removeAt(index);
  }

  
  removegeneralGoalByProgramByCompanyType(index: number) {
    const generalGoalByProgramByCompanyType = this.generalGoalByProgramByCompanyType.at(index).value;
    if (generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType) {
      this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.push(generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType); 
    }
    this.generalGoalByProgramByCompanyType.removeAt(index);
  }


  operate() {
    if (this.form.invalid) {
      return;
    }

    const generalGoal: GeneralGoal = this.form.value;

    const deleteSpecificGoals = this.idsToDeleteSpecificGoal.map(id => this.specificGoalService.delete(id));
    const deleteGeneralGoalByProgramByCompanyType = this.idsToDeleteGeneralGoalByProgramByCompanyTypeService.map(id => this.generalGoalByProgramByCompanyTypeService.delete(id));

    if (deleteGeneralGoalByProgramByCompanyType.length > 0 ) {
      forkJoin(deleteGeneralGoalByProgramByCompanyType).pipe(
        switchMap(() => {
          return this.saveOrUpdateGeneralGoal(generalGoal);
        })
      ).subscribe(() => {
        this.navigateToGeneralGoalList();
      });
    } else {
      this.saveOrUpdateGeneralGoal(generalGoal).subscribe(() => {
        this.navigateToGeneralGoalList();
      });
      console.log(generalGoal)
    }
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
}