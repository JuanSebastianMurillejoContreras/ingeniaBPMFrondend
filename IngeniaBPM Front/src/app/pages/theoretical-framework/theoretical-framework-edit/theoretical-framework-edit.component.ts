import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { TheoreticalFrameworkByProgram } from 'src/app/model/TheoreticalFrameworkByProgram';
import { CompanyType } from 'src/app/model/companyType';
import { Program } from 'src/app/model/program';
import { TheoreticalFramework, TheoreticalFrameworkByCompanyType } from 'src/app/model/theoreticalFramework';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { ProgramService } from 'src/app/service/program.service';
import { TheoreticalFrameworkByCompanyTypeService } from 'src/app/service/theoretical-framework-by-company-type.service';
import { TheoreticalFrameworkService } from 'src/app/service/theoretical-framework.service';
import { TheoreticalFrameworkByProgramService } from 'src/app/service/theoreticalframeworkbyprogram.service';

@Component({
  selector: 'app-theoretical-framework-edit',
  standalone: true,
  templateUrl: './theoretical-framework-edit.component.html',
  styleUrls: ['./theoretical-framework-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})
export class TheoreticalFrameworkEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;


  idsToDeleteTheoreticalFrameworkByProgramService: number[] = [];
  idsToDeleteTheoreticalFrameworkByCompanyTypeService: number[] = [];

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  theoreticalFrameworkByProgram: TheoreticalFrameworkByProgram[];

  theoreticalFrameworkByCompanyType: TheoreticalFrameworkByCompanyType[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private theoreticalFrameworkService: TheoreticalFrameworkService,
    private theoreticalFrameworkByProgramService: TheoreticalFrameworkByProgramService,
    private theoreticalFrameworkByCompanyTypeService: TheoreticalFrameworkByCompanyTypeService,
    private companyTypeService: CompanyTypeService,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idTheoreticalFramework: [0],
      generalConsiderations: ['', Validators.required],
      specificConsiderations: ['', Validators.required],
      urlAnnexed: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]],
      lstTheoreticalFrameworkByProgram: this.fb.array([]),
      lstTheoreticalFrameworkByCompanyType: this.fb.array([])
    });

    this.loadInitialData();
    this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe(startWith(''), map(val => this.filterCompanyType(val)));
    this.programFiltered$ = this.programControl.valueChanges.pipe(startWith(''), map(val => this.filterProgram(val)));


    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
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
      this.theoreticalFrameworkService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idTheoreticalFramework: data.idTheoreticalFramework,
          generalConsiderations: data.generalConsiderations,
          specificConsiderations: data.specificConsiderations,
          urlAnnexed: data.urlAnnexed
        });
        this.setTheoreticalFrameworkByProgram(data.lstTheoreticalFrameworkByProgram);
        this.setTheoreticalFrameworkByCompanyType(data.lstTheoreticalFrameworkByCompanyType);
      });
    }
  }

  setTheoreticalFrameworkByProgram(TheoreticalFrameworkByProgram: TheoreticalFrameworkByProgram[]) {
    const lstTheoreticalFrameworkByProgram = this.form.get('lstTheoreticalFrameworkByProgram') as FormArray;
    TheoreticalFrameworkByProgram.forEach(TheoreticalFrameworkByProgram => {
      lstTheoreticalFrameworkByProgram.push(this.fb.group({
        idTheoreticalFrameworkByProgram: [TheoreticalFrameworkByProgram.idTheoreticalFrameworkByProgram],
        program: [TheoreticalFrameworkByProgram.program, Validators.required]
      }));
    });
  }

  setTheoreticalFrameworkByCompanyType(TheoreticalFrameworkByCompanyType: TheoreticalFrameworkByCompanyType[]) {
    const lstTheoreticalFrameworkByCompanyType = this.form.get('lstTheoreticalFrameworkByCompanyType') as FormArray;
    TheoreticalFrameworkByCompanyType.forEach(TheoreticalFrameworkByCompanyType => {
      lstTheoreticalFrameworkByCompanyType.push(this.fb.group({
        idTheoreticalFrameworkByCompanyType: [TheoreticalFrameworkByCompanyType.idTheoreticalFrameworkByCompanyType],
        companyType: [TheoreticalFrameworkByCompanyType.companyType, Validators.required]
      }));
    });
  }

  get theoreticalFrameworkByPrograms() {
    return this.form.get('lstTheoreticalFrameworkByProgram') as FormArray;
  }

  get theoreticalFrameworkByCompanyTypes() {
    return this.form.get('lstTheoreticalFrameworkByCompanyType') as FormArray;
  }

  addTheoreticalFrameworkByProgram() {
    this.theoreticalFrameworkByPrograms.push(this.fb.group({
      idTheoreticalFrameworkByProgram: [0],
      program: ['', Validators.required]
    }));
  }

  addTheoreticalFrameworkByCompanyType() {
    this.theoreticalFrameworkByCompanyTypes.push(this.fb.group({
      idTheoreticalFrameworkByCompanyType: [0],
      companyType: ['', Validators.required]
    }));
  }

  removeTheoreticalFrameworkByProgram(index: number) {
    const TheoreticalFrameworkByProgram = this.theoreticalFrameworkByPrograms.at(index).value;
    if (TheoreticalFrameworkByProgram.idTheoreticalFrameworkByProgram) {
      this.idsToDeleteTheoreticalFrameworkByProgramService.push(TheoreticalFrameworkByProgram.idTheoreticalFrameworkByProgram);
    }
    this.theoreticalFrameworkByPrograms.removeAt(index);
  }

  removeTheoreticalFrameworkByCompanyType(index: number) {
    const TheoreticalFrameworkByCompanyType = this.theoreticalFrameworkByCompanyTypes.at(index).value;
    if (TheoreticalFrameworkByCompanyType.idTheoreticalFrameworkByCompanyType) {
      this.idsToDeleteTheoreticalFrameworkByCompanyTypeService.push(TheoreticalFrameworkByCompanyType.idTheoreticalFrameworkByCompanyType);
    }
    this.theoreticalFrameworkByCompanyTypes.removeAt(index);
  }

  deleteTheoreticalFrameworkByProgram(): Observable<any> {
    if (this.idsToDeleteTheoreticalFrameworkByProgramService.length === 0) {
      return of(null);
    }
    const deleteTheoreticalFrameworkByProgram$ = this.idsToDeleteTheoreticalFrameworkByProgramService.map(id =>
      this.theoreticalFrameworkByProgramService.delete(id)
    );
    return forkJoin(deleteTheoreticalFrameworkByProgram$);
  }

  deleteTheoreticalFrameworkByCompanyType(): Observable<any> {
    if (this.idsToDeleteTheoreticalFrameworkByCompanyTypeService.length === 0) {
      return of(null);
    }
    const deleteTheoreticalFrameworkByCompanyType$ = this.idsToDeleteTheoreticalFrameworkByCompanyTypeService.map(id =>
      this.theoreticalFrameworkByCompanyTypeService.delete(id)
    );
    return forkJoin(deleteTheoreticalFrameworkByCompanyType$);
  }


  saveOrUpdateTheoreticalFramework(theoreticalFramework: TheoreticalFramework): Observable<any> {
    if (this.isEdit) {
      return this.theoreticalFrameworkService.update(theoreticalFramework.idTheoreticalFramework, theoreticalFramework).pipe(
        switchMap(() => this.theoreticalFrameworkService.findAll()),
        tap(data => {
          this.theoreticalFrameworkService.setTheoreticalFrameworkChange(data);
          this.theoreticalFrameworkService.setMessageChange('Marco teórico actualizado!');
        })
      );
    } else {
      return this.theoreticalFrameworkService.save(theoreticalFramework).pipe(
        switchMap(() => this.theoreticalFrameworkService.findAll()),
        tap(data => {
          this.theoreticalFrameworkService.setTheoreticalFrameworkChange(data);
          this.theoreticalFrameworkService.setMessageChange('Marco teórico actualizado!');
        })
      );
    }
  }


  operate() {
    if (this.form.invalid) {
      return;
    }

    const theoreticalFramework: TheoreticalFramework = this.form.value;

    forkJoin([
      this.deleteTheoreticalFrameworkByCompanyType(),
      this.deleteTheoreticalFrameworkByProgram()
    ]).pipe(
      switchMap(() => this.saveOrUpdateTheoreticalFramework(theoreticalFramework)),
    ).subscribe(() => {
      this.navigateToTheoreticalFrameworkList();
    });
  }

  navigateToTheoreticalFrameworkList() {
    this.router.navigate(['/pages/theoreticalframework']);
  }

}
