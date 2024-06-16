import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { GeneralGoalByProgramByCompanyType } from 'src/app/model/generalGoalByProgramByCompanyType';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { GeneralGoalByProgramByCompanyTypeService } from 'src/app/service/general-goal-by-program-by-company-type.service';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { ProgramService } from 'src/app/service/program.service';

@Component({
  standalone: true,
  selector: 'app-general-goal-by-program-by-company-type-edit',
  templateUrl: './general-goal-by-program-by-company-type-edit.component.html',
  styleUrls: ['./general-goal-by-program-by-company-type-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class GeneralGoalByProgramByCompanyTypeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  generalGoalByProgramByCompanyType: GeneralGoalByProgramByCompanyType[];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  generalGoal: GeneralGoal[];
  generalGoalControl: FormControl = new FormControl();
  generalGoalFiltered$: Observable<GeneralGoal[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalGoalByProgramByCompanyTypeService: GeneralGoalByProgramByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private generalGoalService: GeneralGoalService,
    private programService: ProgramService

  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGeneralGoalByProgramByCompanyType': new FormControl(0),
      'generalGoal': this.generalGoalControl,
      'program': this.programControl,
      'companyType': this.companyTypeControl
    });

    this.loadInitialData()

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
  }

  filterGeneralGoal( val: any ): GeneralGoal[] {
    if ( !val ) {
      return this.generalGoal;
    }

    if ( val?.idGlossary > 0 ) {
      return this.generalGoal.filter( el =>
        el.generalGoal.toLowerCase().includes( val.generalGoal.toLowerCase() ) );
    } else {
      return this.generalGoal.filter( el =>
        el.generalGoal.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }

  filterProgram( val: any ): Program[] {
    if ( !val ) {
      return this.program;
    }

    if ( val?.idProgram > 0 ) {
      return this.program.filter( el =>
        el.name.toLowerCase().includes( val.name.toLowerCase() ) );
    } else {
      return this.program.filter( el =>
        el.name.toLowerCase().includes( val?.toLowerCase() ) );
    }
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
    this.generalGoalByProgramByCompanyTypeService.findAll().subscribe(data => this.generalGoalByProgramByCompanyType = data);
    this.generalGoalService.findAll().subscribe( data => this.generalGoal = data );
    this.programService.findAll().subscribe( data => this.program = data );
    this.companyTypeService.findAll().subscribe( data => this.companyType = data );

    
  }
  showGeneralGoal( val: any ) {
    return val ? `${val.generalGoal}` : val;
  }

  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.generalGoalByProgramByCompanyTypeService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idGlossaryByProgramByCompanyType': data.idGeneralGoalByProgramByCompanyType,
          'generalGoal': data.generalGoal,
          'program': data.program,
          'companyType': data.companyType,
        })
      })
    }
  }


  operate() {
    if (this.form.invalid) {return;}

    let generalGoalByProgramByCompanyType = new GeneralGoalByProgramByCompanyType();
    
    generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType = this.form.value['idGeneralGoalByProgramByCompanyType'];
    generalGoalByProgramByCompanyType.generalGoal = this.form.value['generalGoal'];
    generalGoalByProgramByCompanyType.program = this.form.value['program'];
    generalGoalByProgramByCompanyType.companyType = this.form.value['companyType']      


    if (this.isEdit) {
      this.generalGoalByProgramByCompanyTypeService.update(generalGoalByProgramByCompanyType.idGeneralGoalByProgramByCompanyType, generalGoalByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.generalGoalByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.generalGoalByProgramByCompanyTypeService.setGeneralGoalByProgramByCompanyTypeChange(data);
          this.generalGoalByProgramByCompanyTypeService.setMessageChange('Glosario Actualizado!')
        });

    } else {
      this.generalGoalByProgramByCompanyTypeService.save(generalGoalByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.generalGoalByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.generalGoalByProgramByCompanyTypeService.setGeneralGoalByProgramByCompanyTypeChange(data);
          this.generalGoalByProgramByCompanyTypeService.setMessageChange("Glosario creado!")
          console.log(generalGoalByProgramByCompanyType)
        });
    }


    this.router.navigate(['/pages/generalgoalbyprogrambycompanytype']);
  }

}
