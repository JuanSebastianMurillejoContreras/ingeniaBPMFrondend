import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
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
  selector: 'app-glossary-edit',
  templateUrl: './glossary-edit.component.html',
  styleUrls: ['./glossary-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class GlossaryEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  idProgram: number;
  isEditIdProgram: boolean;

  form: FormGroup

  program1: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  glossary: Glossary[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private companyTypeService: CompanyTypeService,
    private glossaryService: GlossaryService,
    private glossaryByProgramByCompanyTypeService: GlossaryByProgramByCompanyTypeService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossaryByProgramByCompanyType': new FormControl(0),
      'glossaryWord': new FormControl('', [Validators.required]),
      'glossaryDefinition': new FormControl('', [Validators.required]),
      'program': this.programControl,
      'companyType': this.companyTypeControl
    });

    this.loadInitialData()
    //this.programFiltered$ = this.programControl.valueChanges.pipe(map(val => this.filterProgram(val)));
    //this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe(map(val => this.filterCompanyType(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
  }


  filterProgram(val: any): Program[] {
    if (!val) {
      return this.program1;
    }

    if (val?.idClient > 0) {
      return this.program1.filter(el =>
        el.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      console.log(val)
      return this.program1.filter(el =>
        el.name.toLowerCase().includes(val?.toLowerCase()));
    }
  }
  filterCompanyType(val: any): CompanyType[] {
    if (!val) {
      return this.companyType;
    }

    if (val?.idcompanyType > 0) {
      return this.companyType.filter(el =>
        el.nameCompanyType.toLowerCase().includes(val.nameCompanyType.toLowerCase()));
    } else {
      console.log(val)
      return this.companyType.filter(el =>
        el.nameCompanyType.toLowerCase().includes(val?.toLowerCase()));
    }
  }

  loadInitialData() {
    this.programService.findAll().subscribe(data => this.program1 = data);
    this.companyTypeService.findAll().subscribe(data => this.companyType = data);
    this.glossaryService.findAll().subscribe(data => this.glossary = data);
  }

  showProgram(val: any) {
    return val ? `${val.name}` : val;
  }

  showCompanyType(val: any) {
    return val ? `${val.nameCompanyType}` : val;
  }

  initForm() {
    if (this.isEdit) {
      this.glossaryByProgramByCompanyTypeService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idGlossaryByProgramByCompanyType': data.idGlossaryByProgramByCompanyType,
          'glossaryWord': data.glossary.word,
          'glossaryDefinition': data.glossary.definition,
          'program': data.program,
          'companyType': data.companyType
        })
        //console.log(data)
      })

    }
  }


  operate() {
    if (this.form.invalid) {
      return;
    }
    let glossaryByProgramByCompanyType = new GlossaryByProgramByCompanyType();
    glossaryByProgramByCompanyType.idGlossaryByProgramByCompanyType = this.form.value['idGlossaryByProgramByCompanyType'];
    glossaryByProgramByCompanyType.glossary = this.form.value['glossaryWord'];
    glossaryByProgramByCompanyType.glossary = this.form.value['glossaryDefinition'];
    glossaryByProgramByCompanyType.program = this.form.value['program'];
    glossaryByProgramByCompanyType.companyType = this.form.value['companyType'];
    console.log("glossaryByProgramByCompanyType" + glossaryByProgramByCompanyType)


    if (this.isEdit) {
      this.glossaryByProgramByCompanyTypeService.update(glossaryByProgramByCompanyType.idGlossaryByProgramByCompanyType, glossaryByProgramByCompanyType).pipe(switchMap(() => {
        return this.glossaryByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.glossaryByProgramByCompanyTypeService.setGlossaryByProgramByCompanyTypeChange(data);
          this.glossaryByProgramByCompanyTypeService.setMessageChange('Glosario Actualizado!')
        });

    } else {
      this.glossaryByProgramByCompanyTypeService.save(glossaryByProgramByCompanyType).pipe(switchMap(() => {
        return this.glossaryByProgramByCompanyTypeService.findAll();
      }))
        .subscribe(data => {
          this.glossaryByProgramByCompanyTypeService.setGlossaryByProgramByCompanyTypeChange(data);
          this.glossaryByProgramByCompanyTypeService.setMessageChange("Glosario creado!")
        });
    }



    this.router.navigate(['/pages/glossary']);
  }

}


