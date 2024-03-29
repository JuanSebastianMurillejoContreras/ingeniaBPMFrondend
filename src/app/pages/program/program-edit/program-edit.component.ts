import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Program } from 'src/app/model/program';
import { TheoreticalFramework } from 'src/app/model/theoreticalFramework';
import { ProgramService } from 'src/app/service/program.service';
import { TheoreticalFrameworkService } from 'src/app/service/theoretical-framework.service';

@Component({
  selector: 'app-program-edit',
  standalone: true,
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class ProgramEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      'idProgram': new FormControl( 0 ),
      'code': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 1200 )] ),
      'name': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 1200 )] ),
      'description': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 1200 )] )
    } );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )

  }

  initForm() {
    if ( this.isEdit ) {
      this.programService.findById( this.id ).subscribe( data => {
        this.form = new FormGroup( {
          'idProgram': new FormControl(data.idProgram),
          'code': new FormControl(data.code),
          'name': new FormControl(data.name),
          'description': new FormControl(data.description) 
        } );
    });
  }
}

  get f() {
  return this.form.controls;
}

operate() {
  if ( this.form.invalid ) { return; }
  let program = new Program();
  program.idProgram = this.form.value['idProgram'];
  program.code = this.form.value['code'];
  program.name = this.form.value['name'];
  program.description = this.form.value['description'];


  if ( this.isEdit ) {
    this.programService.update( program.idProgram, program ).pipe( switchMap( () => {
      return this.programService.findAll();
    } ) )
      .subscribe( data => {
        this.programService.setProgramChange( data );
        this.programService.setMessageChange( 'Programa actualizado!' )

      } );  
  } else {
    this.programService.save( program ).pipe( switchMap( () => {
      return this.programService.findAll();
    } ) )
      .subscribe( data => {
        this.programService.setProgramChange( data );
        this.programService.setMessageChange( "Programa creado!" )
      } );
  }
  this.router.navigate( ['/pages/program'] );
}

}
