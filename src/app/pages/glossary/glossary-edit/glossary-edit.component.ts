import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GlossaryByProgramByCompanyType } from 'src/app/model/GlossaryByProgramByCompanyType';
import { Program } from 'src/app/model/program';
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

  glossaryByProgramByCompanyType: GlossaryByProgramByCompanyType[]; 

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private glossaryByProgramByCompanyTypeService: GlossaryByProgramByCompanyTypeService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossaryByProgramByCompanyType': new FormControl(0),
      'glossaryWord': new FormControl('', [Validators.required]),
      'glossaryDefinition': new FormControl('', [Validators.required]),
      'programName': this.programControl,
      'companyType': new FormControl('', [Validators.required]),
    });

    this.loadInitialData()
    this.programFiltered$ = this.programControl.valueChanges.pipe(map(val => this.filterProgram(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
  }


  filterProgram( val: any ): Program[] {
    if ( !val ) {
      return this.program;
    }

    if ( val?.idClient > 0 ) {
      return this.program.filter( el =>
        el.name.toLowerCase().includes( val.name.toLowerCase() ) );
    } else {
      return this.program.filter( el =>
        el.name.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }

  loadInitialData() {
    this.programService.findAll().subscribe(data => this.program = data);
  }

  showProgram(val: any) {
    return val ? `${val.name}` : val;
  }

  initForm() {
      if (this.isEdit) {
        this.glossaryByProgramByCompanyTypeService.findById(this.id).subscribe(data => {
          this.form.setValue({
            'idGlossaryByProgramByCompanyType': data.idGlossaryByProgramByCompanyType,
    'glossaryWord': data.glossary.word,
    'glossaryDefinition': data.glossary.definition,
    'programName': data.program.name || '', // Verifica si es nulo o indefinido
    'companyType': data.companyType.nameCompanyType
            
          })
          console.log(data.program.name)
        })
       
      }
    }
   

  operate() {
    if (this.form.invalid) { return; }
    let glossaryByProgramByCompanyType = new GlossaryByProgramByCompanyType();
    glossaryByProgramByCompanyType.idGlossaryByProgramByCompanyType = this.form.value['idGlossaryByProgramByCompanyType'];
    glossaryByProgramByCompanyType.glossary = this.form.value['glossaryWord'];
    glossaryByProgramByCompanyType.program = this.form.value['programName'];
    glossaryByProgramByCompanyType.companyType = this.form.value['companyType'];
    


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


