import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { TheoreticalFrameworkByProgramByCompanyType } from 'src/app/model/TheoreticalFrameworkByProgramByCompanyType';
import { CompanyType } from 'src/app/model/companyType';
import { Program } from 'src/app/model/program';
import { TheoreticalFramework } from 'src/app/model/theoreticalFramework';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { ProgramService } from 'src/app/service/program.service';
import { TheoreticalFrameworkByProgramByCompanyTypeService } from 'src/app/service/theoretical-framework-by-program-by-company-type.service';
import { TheoreticalFrameworkService } from 'src/app/service/theoretical-framework.service';

@Component({
  standalone: true,
  selector: 'app-theoretical-framework-by-program-by-company-type-edit',
  templateUrl: './theoretical-framework-by-program-by-company-type-edit.component.html',
  styleUrls: ['./theoretical-framework-by-program-by-company-type-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class TheoreticalFrameworkByProgramByCompanyTypeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  theoreticalFrameworkByProgramByCompanyType: TheoreticalFrameworkByProgramByCompanyType[];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  theoreticalFramework: TheoreticalFramework[];
  theoreticalFrameworkControl: FormControl = new FormControl();
  theoreticalFrameworkFiltered$: Observable<TheoreticalFramework[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private theoreticalFrameworkByProgramByCompanyTypeService: TheoreticalFrameworkByProgramByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private theoreticalFrameworkService: TheoreticalFrameworkService,
    private programService: ProgramService

  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idTheoreticalFrameworkByProgramByCompanyType': new FormControl(0),
      'theoreticalFramework': this.theoreticalFrameworkControl,
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

  filterTheoreticalFramework( val: any ): TheoreticalFramework[] {
    if ( !val ) {
      return this.theoreticalFramework;
    }

    if ( val?.idGlossary > 0 ) {
      return this.theoreticalFramework.filter( el =>
        el.generalConsiderations.toLowerCase().includes( val.generalConsiderations.toLowerCase() ) );
    } else {
      return this.theoreticalFramework.filter( el =>
        el.generalConsiderations.toLowerCase().includes( val?.toLowerCase() ) );
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
    this.theoreticalFrameworkByProgramByCompanyTypeService.findAll().subscribe(data => this.theoreticalFrameworkByProgramByCompanyType = data);
    this.theoreticalFrameworkService.findAll().subscribe( data => this.theoreticalFramework = data );
    this.programService.findAll().subscribe( data => this.program = data );
    this.companyTypeService.findAll().subscribe( data => this.companyType = data );

    
  }
  showTheoreticalFramework( val: any ) {
    return val ? `${val.generalConsiderations}` : val;
  }

  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.theoreticalFrameworkByProgramByCompanyTypeService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idTheoreticalFrameworkByProgramByCompanyType': data.idTheoreticalFrameworkByProgramByCompanyType,
          'theoreticalFramework': data.theoreticalFramework,
          'program': data.program,
          'companyType': data.companyType,
        })
      })
    }
  }


  operate() {
    if (this.form.invalid) {return;}

    let theoreticalFrameworkByProgramByCompanyType = new TheoreticalFrameworkByProgramByCompanyType();
    
    theoreticalFrameworkByProgramByCompanyType.idTheoreticalFrameworkByProgramByCompanyType = this.form.value['idTheoreticalFrameworkByProgramByCompanyType'];
    theoreticalFrameworkByProgramByCompanyType.theoreticalFramework = this.form.value['theoreticalFramework'];
    theoreticalFrameworkByProgramByCompanyType.program = this.form.value['program'];
    theoreticalFrameworkByProgramByCompanyType.companyType = this.form.value['companyType']      


    if (this.isEdit) {
      this.theoreticalFrameworkByProgramByCompanyTypeService.update(theoreticalFrameworkByProgramByCompanyType.idTheoreticalFrameworkByProgramByCompanyType, theoreticalFrameworkByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.theoreticalFrameworkByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.theoreticalFrameworkByProgramByCompanyTypeService.setTheoreticalFrameworkByProgramByCompanyTypeChange(data);
          this.theoreticalFrameworkByProgramByCompanyTypeService.setMessageChange('Glosario Actualizado!')
        });

    } else {
      this.theoreticalFrameworkByProgramByCompanyTypeService.save(theoreticalFrameworkByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.theoreticalFrameworkByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.theoreticalFrameworkByProgramByCompanyTypeService.setTheoreticalFrameworkByProgramByCompanyTypeChange(data);
          this.theoreticalFrameworkByProgramByCompanyTypeService.setMessageChange("Glosario creado!")
          console.log(theoreticalFrameworkByProgramByCompanyType)
        });
    }


    this.router.navigate(['/pages/theoreticalframeworkbyprogrambycompanytype']);
  }

}
