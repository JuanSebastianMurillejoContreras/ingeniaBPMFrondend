import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GlossaryByCompanyType } from 'src/app/model/GlossaryByCompanyType';
import { CompanyType } from 'src/app/model/companyType';
import { GeneralGoalByCompanyType } from 'src/app/model/generalGoal';
import { Glossary, GlossaryByProgram } from 'src/app/model/glossary';
import { Program } from 'src/app/model/program';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { GlossaryService } from 'src/app/service/glossary.service';
import { GlossaryByCompanyTypeService } from 'src/app/service/glossarybycompanytype.service';
import { GlossaryByProgramService } from 'src/app/service/glossarybyprogram.service';
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
  form: FormGroup;

  idsToDeleteglossaryByProgramService: number[] = [];
  idsToDeleteglossaryByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  glossaryByProgram: GlossaryByProgram[];

  generalGoalByCompanyType: GeneralGoalByCompanyType[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private glossaryService: GlossaryService,
    private glossaryByProgramService: GlossaryByProgramService,
    private glossaryByCompanyTypeService: GlossaryByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idGlossary: [0],
      word: ['', Validators.required],
      definition: ['', Validators.required],
      lstGlossaryByProgram: this.fb.array([]),
      lstGlossaryByCompanyType: this.fb.array([])
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
      this.glossaryService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idGlossary: data.idGlossary,
          word: data.word,
          definition: data.definition,
        });
        this.setGlossaryByProgram(data.lstGlossaryByProgram);
        this.setGlossaryByCompanyType(data.lstGlossaryByCompanyType);
      });
    }
  }

  setGlossaryByProgram(glossaryByProgram: GlossaryByProgram[]) {
    const lstglossaryByProgram = this.form.get('lstGlossaryByProgram') as FormArray;
    glossaryByProgram.forEach(glossaryByProgram => {
      lstglossaryByProgram.push(this.fb.group({
        idGlossaryByProgram: [glossaryByProgram.idGlossaryByProgram],
        program: [glossaryByProgram.program, Validators.required]
      }));
    });
  }

  setGlossaryByCompanyType(glossaryByCompanyType: GlossaryByCompanyType[]) {
    const lstglossaryByCompanyType = this.form.get('lstGlossaryByCompanyType') as FormArray;
    glossaryByCompanyType.forEach(glossaryByCompanyType => {
      lstglossaryByCompanyType.push(this.fb.group({
        idGlossaryByCompanyType: [glossaryByCompanyType.idGlossaryByCompanyType],
        companyType: [glossaryByCompanyType.companyType, Validators.required]
      }));
    });
  }

  get glossaryByPrograms() {
    return this.form.get('lstGlossaryByProgram') as FormArray;
  }

  get glossaryByCompanyTypes() {
    return this.form.get('lstGlossaryByCompanyType') as FormArray;
  }

  addGlossaryByProgram() {
    this.glossaryByPrograms.push(this.fb.group({
      idGlossaryByProgram: [0],
      program: ['', Validators.required]
    }));
    
  }

  addGlossaryByCompanyType() {
    this.glossaryByCompanyTypes.push(this.fb.group({
      idGlossaryByCompanyType: [0],
      companyType: ['', Validators.required]
    }));
  }

  removeGlossaryByProgram(index: number) {
    const glossaryByProgram = this.glossaryByPrograms.at(index).value;
    if (glossaryByProgram.idGlossaryByProgram) {
      this.idsToDeleteglossaryByProgramService.push(glossaryByProgram.idGlossaryByProgram);
    }
    this.glossaryByPrograms.removeAt(index);
  }

  removeGlossaryByCompanyType(index: number) {
    const glossaryByCompanyType = this.glossaryByCompanyTypes.at(index).value;
    if (glossaryByCompanyType.idGlossaryByCompanyType) {
      this.idsToDeleteglossaryByCompanyTypeService.push(glossaryByCompanyType.idGlossaryByCompanyType);
    }
    this.glossaryByCompanyTypes.removeAt(index);
  }

  deleteGlossaryByProgram(): Observable<any> {
    if (this.idsToDeleteglossaryByProgramService.length === 0) {
      return of(null);
    }
    const deleteglossaryByProgram$ = this.idsToDeleteglossaryByProgramService.map(id =>
      this.glossaryByProgramService.delete(id)
    );
    return forkJoin(deleteglossaryByProgram$);
  }

  deleteGlossaryByCompanyType(): Observable<any> {
    if (this.idsToDeleteglossaryByCompanyTypeService.length === 0) {
      return of(null);
    }
    const deleteGlossaryByCompanyType$ = this.idsToDeleteglossaryByCompanyTypeService.map(id =>
      this.glossaryByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteGlossaryByCompanyType$);
  }


  saveOrUpdateGeneralGoal(glossary: Glossary): Observable<any> {
    if (this.isEdit) {
      return this.glossaryService.update(glossary.idGlossary, glossary).pipe(
        switchMap(() => this.glossaryService.findAll()),
        tap(data => {
          this.glossaryService.setGlossaryChange(data);
          this.glossaryService.setMessageChange('Glosario actualizado!');
        })
      );
    } else {
      return this.glossaryService.save(glossary).pipe(
        switchMap(() => this.glossaryService.findAll()),
        tap(data => {
          this.glossaryService.setGlossaryChange(data);
          this.glossaryService.setMessageChange('Glosario creado!');
        })
      );
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const glossary: Glossary = this.form.value;

    forkJoin([
      this.deleteGlossaryByCompanyType(),
      this.deleteGlossaryByProgram()
    ]).pipe(
      switchMap(() => this.saveOrUpdateGeneralGoal(glossary)),
    ).subscribe(() => {
      this.navigateToGeneralGoalList();
    });
  }

  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/glossary']);
  }

}
