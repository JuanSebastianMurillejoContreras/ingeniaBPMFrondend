import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Company } from 'src/app/model/company';
import { Program } from 'src/app/model/program';
import { ProgramByCompany } from 'src/app/model/programbyCompany';
import { CompanyService } from 'src/app/service/company.service';
import { ProgramService } from 'src/app/service/program.service';
import { ProgrambycompanyService } from 'src/app/service/programbycompany.service';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component( {
  selector: 'app-programbycompany-edit',
  standalone: true,
  templateUrl: './programbycompany-edit.component.html',
  styleUrls: ['./programbycompany-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, MatCardModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet, CdkDropListGroup, CdkDropList, CdkDrag]
} )
export class ProgrambycompanyEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  company: Company[];
  companyControl: FormControl = new FormControl();
  companyFiltered$: Observable<Company[]>;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  programs: Program[] = [];
  programsByCompany: ProgramByCompany[];
  draggingItem: Program | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programByCompanyService: ProgrambycompanyService,
    private programService: ProgramService,
    private companyService: CompanyService
  ) {
   }


dropCompany(event: CdkDragDrop<any[]>) {
  if (this.draggingItem) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        this.programs,
        event.container.data,
        this.programs.indexOf(this.draggingItem),
        event.currentIndex
      );
    }
    this.draggingItem = null;
  }
}
  
drop(event: CdkDragDrop<any[]>) {
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

dropProgram(program: Program) {
    this.draggingItem = program;
  }


  ngOnInit(): void {
    this.form = new FormGroup( {
      'idProgramByCompany': new FormControl( 0 ),
      'program': this.programControl,
      'company': this.companyControl
    } );

    this.loadInitialData();
    this.programFiltered$ = this.programControl.valueChanges.pipe( map( val => this.filterProgram( val ) ) );
    this.companyFiltered$ = this.companyControl.valueChanges.pipe( map( val => this.filterCompany( val ) ) );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
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

  filterCompany( val: any ): Company[] {
    if ( !val ) {
      return this.company;
    }

    if ( val?.idProgram > 0 ) {
      return this.company.filter( el =>
        el.name.toLowerCase().includes( val.name.toLowerCase() ) );
    } else {
      return this.company.filter( el =>
        el.name.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }

  loadInitialData() {
    this.programService.findAll().subscribe( data => this.program = data );
    this.companyService.findAll().subscribe( data => this.company = data );
    this.programByCompanyService.findAll().subscribe( data => this.programsByCompany = data)  
  }

  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  showCompany( val: any ) {
    return val ? `${val.name}` : val;
  }

  initForm() {
    if ( this.isEdit ) {
      this.programByCompanyService.findById( this.id ).subscribe( data => {
        this.form.setValue( {
          'idProgramByCompany': data.idProgramByCompany,
          'program': data.program,
          'company': data.company,
        } );
      } );
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if ( this.form.invalid ) { return; }
    let programByCompany = new ProgramByCompany();
    programByCompany.idProgramByCompany = this.form.value['idProgramByCompany'];
    programByCompany.program = this.form.value['program']
    programByCompany.company = this.form.value['company'];


    if ( this.isEdit ) {
      this.programByCompanyService.update( programByCompany.idProgramByCompany, programByCompany ).pipe( switchMap( () => {
        return this.programByCompanyService.findAll();
      } ) )
        .subscribe( data => {
          this.programByCompanyService.setProgramByCompanyChange( data );
          this.programByCompanyService.setMessageChange( 'Programa por empresa actualizado!' )

        } );
    } else {
      this.programByCompanyService.save( programByCompany ).pipe( switchMap( () => {
        return this.programByCompanyService.findAll();
      } ) )
        .subscribe( data => {
          this.programByCompanyService.setProgramByCompanyChange( data );
          this.programByCompanyService.setMessageChange( "Programa por empresa asociado!" )
        } );
    }
    this.router.navigate( ['/pages/programbycompany'] );
  }

}