import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Glossary } from 'src/app/model/glossary';
import { Program } from 'src/app/model/program';
import { GlossaryByProgramByCompanyTypeService } from 'src/app/service/glossary-by-program-by-company-type.service';
import { GlossaryService } from 'src/app/service/glossary.service';
import { ProgramService } from 'src/app/service/program.service';

@Component( {
  standalone: true,
  selector: 'app-glossary-edit',
  templateUrl: './glossary-edit.component.html',
  styleUrls: ['./glossary-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )
export class GlossaryEditComponent implements OnInit {

  id: number;
  isEdit: boolean;

form: FormGroup

  formGlossary: FormGroup;
  formGlossaryByProgramByCompanyType: FormGroup;

  program: Program[];
  programControl: FormControl = new FormControl();
  programFiltered$: Observable<Program[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private glossaryService: GlossaryService,
    private programService: ProgramService,
    private glossaryByProgramByCompanyTypeService: GlossaryByProgramByCompanyTypeService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossary': new FormControl( 0 ),
      'word': new FormControl( '', [Validators.required, Validators.minLength( 3 ), Validators.maxLength( 50 )] ),
      'definition': new FormControl( '', [Validators.required, Validators.minLength( 3 ), Validators.maxLength( 1200 )] ), 
      program: this.programControl           
    } );

    this.loadInitialData()
    this.programFiltered$ = this.programControl.valueChanges.pipe(map(val => this.filterProgram(val)));

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


  loadInitialData() {
    this.programService.findAll().subscribe( data => this.program = data );    
  }

  showProgram( val: any ) {
    return val ? `${val.name}` : val;
  }

  initForm() {
    if ( this.isEdit ) {
      this.glossaryService.findById( this.id ).subscribe( data => {
        this.formGlossary.setValue( {
          'idGlossary': data.idGlossary,
          'word': data.word,
          'definition': data.definition,
        } );
      });
    }
    if ( this.isEdit ) {
      this.glossaryByProgramByCompanyTypeService.findById( this.id ).subscribe( data => {
        this.formGlossaryByProgramByCompanyType.setValue( {
          'idGlossaryByProgramByCompanyType': data.idGlossaryByProgramByCompanyType,
          'program': data.program,
          'companyType': data.companyType,
          'glossary': data.glossary
        })
      })
    }
  }

  get f() {
    return this.formGlossary.controls;
    return this.formGlossaryByProgramByCompanyType.controls;
  }

  operate() {
    if ( this.formGlossary.invalid ) { return; }
    let glossary = new Glossary();
    glossary.idGlossary = this.formGlossary.value['idGlossary'];
    glossary.word = this.formGlossary.value['word'];
    glossary.definition = this.formGlossary.value['definition'];


    if ( this.isEdit ) {
      this.glossaryService.update( glossary.idGlossary, glossary ).pipe( switchMap( () => {
        return this.glossaryService.findAll();
      } ) )
        .subscribe( data => {
          this.glossaryService.setGlossaryChange( data );
          this.glossaryService.setMessageChange( 'Palabra actualizada!' )

        } );
    } else {
      this.glossaryService.save( glossary ).pipe( switchMap( () => {
        return this.glossaryService.findAll();
      } ) )
        .subscribe( data => {
          this.glossaryService.setGlossaryChange( data );
          this.glossaryService.setMessageChange( "Palabra creada!" )
        } );
    }
    this.router.navigate( ['/pages/glossary'] );
  }

}
