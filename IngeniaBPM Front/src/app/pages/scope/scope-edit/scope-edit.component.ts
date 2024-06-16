import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Scope } from 'src/app/model/scope';
import { ScopeService } from 'src/app/service/scope.service';

@Component( {
  selector: 'app-scope-edit',
  standalone: true,
  templateUrl: './scope-edit.component.html',
  styleUrls: ['./scope-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )
export class ScopeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ScopeService: ScopeService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      'idScope': new FormControl( 0 ),
      'definitionScope': new FormControl( '', [Validators.required]),
    } );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )

  }

  initForm() {
    if ( this.isEdit ) {
      this.ScopeService.findById( this.id ).subscribe( data => {
        this.form = new FormGroup( {
          'idScope': new FormControl( data.idScope ),
          'definitionScope': new FormControl( data.definitionScope, [Validators.required]),
        } );
      } );
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if ( this.form.invalid ) { return; }
    let scope = new Scope();
    scope.idScope = this.form.value['idScope'];
    scope.definitionScope = this.form.value['definitionScope'];


    if ( this.isEdit ) {
      this.ScopeService.update( scope.idScope, scope ).pipe( switchMap( () => {
        return this.ScopeService.findAll();
      } ) )
        .subscribe( data => {
          this.ScopeService.setScopeChange( data );
          this.ScopeService.setMessageChange( 'Alcance actualizado!' )

        } );
    } else {
      this.ScopeService.save( scope ).pipe( switchMap( () => {
        return this.ScopeService.findAll();
      } ) )
        .subscribe( data => {
          this.ScopeService.setScopeChange( data );
          this.ScopeService.setMessageChange( "Alcance creado!" )
        } );
    }
    this.router.navigate( ['/pages/scope'] );
  }

}
