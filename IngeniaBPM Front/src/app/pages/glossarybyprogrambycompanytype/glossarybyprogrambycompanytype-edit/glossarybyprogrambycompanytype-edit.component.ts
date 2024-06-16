import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GlossaryByProgramByCompanyType } from 'src/app/model/GlossaryByProgramByCompanyType';
import { CompanyType } from 'src/app/model/companyType';
import { Glossary } from 'src/app/model/glossary';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { GlossaryByProgramByCompanyTypeService } from 'src/app/service/glossary-by-program-by-company-type.service';
import { GlossaryService } from 'src/app/service/glossary.service';
import { ProgramService } from 'src/app/service/program.service';

@Component({
  standalone: true,
  selector: 'app-glossarybyprogrambycompanytype-edit',
  templateUrl: './glossarybyprogrambycompanytype-edit.component.html',
  styleUrls: ['./glossarybyprogrambycompanytype-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class GlossarybyprogrambycompanytypeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  glossaryByProgramByCompanyType: GlossaryByProgramByCompanyType[];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  glossary: Glossary[];
  glossaryControl: FormControl = new FormControl();
  glossaryFiltered$: Observable<Glossary[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private glossaryByProgramByCompanyTypeService: GlossaryByProgramByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private glossaryService: GlossaryService,
    private programService: ProgramService

  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossaryByProgramByCompanyType': new FormControl(0),
      'glossary': this.glossaryControl,
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

  filterGlossary( val: any ): Glossary[] {
    if ( !val ) {
      return this.glossary;
    }

    if ( val?.idGlossary > 0 ) {
      return this.glossary.filter( el =>
        el.word.toLowerCase().includes( val.word.toLowerCase() ) );
    } else {
      return this.glossary.filter( el =>
        el.word.toLowerCase().includes( val?.toLowerCase() ) );
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
    this.glossaryByProgramByCompanyTypeService.findAll().subscribe(data => this.glossaryByProgramByCompanyType = data);
    this.glossaryService.findAll().subscribe( data => this.glossary = data );
    this.programService.findAll().subscribe( data => this.program = data );
    this.companyTypeService.findAll().subscribe( data => this.companyType = data );
  }
  
  showGlossary( val: any ) {
    return val ? `${val.word}` : val;
  }

  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }


  initForm() {
    if (this.isEdit) {
      this.glossaryByProgramByCompanyTypeService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idGlossaryByProgramByCompanyType': data.idGlossaryByProgramByCompanyType,
          'glossary': data.glossary,
          'program': data.program,
          'companyType': data.companyType,
        })
      })
    }
  }


  operate() {
    if (this.form.invalid) {return;}

    let glossaryByProgramByCompanyType = new GlossaryByProgramByCompanyType();
    
    glossaryByProgramByCompanyType.idGlossaryByProgramByCompanyType = this.form.value['idGlossaryByProgramByCompanyType'];
    glossaryByProgramByCompanyType.glossary = this.form.value['glossary'];
    glossaryByProgramByCompanyType.program = this.form.value['program'];
    glossaryByProgramByCompanyType.companyType = this.form.value['companyType']      


    if (this.isEdit) {
      this.glossaryByProgramByCompanyTypeService.update(glossaryByProgramByCompanyType.idGlossaryByProgramByCompanyType, glossaryByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.glossaryByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.glossaryByProgramByCompanyTypeService.setGlossaryByProgramByCompanyTypeChange(data);
          this.glossaryByProgramByCompanyTypeService.setMessageChange('Glosario Actualizado!')
        });

    } else {
      this.glossaryByProgramByCompanyTypeService.save(glossaryByProgramByCompanyType)
      .pipe(switchMap(() => {
        return this.glossaryByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.glossaryByProgramByCompanyTypeService.setGlossaryByProgramByCompanyTypeChange(data);
          this.glossaryByProgramByCompanyTypeService.setMessageChange("Glosario creado!")
          console.log(glossaryByProgramByCompanyType)
        });
    }


    this.router.navigate(['/pages/glossarybyprogrambycompanytype']);
  }

}
