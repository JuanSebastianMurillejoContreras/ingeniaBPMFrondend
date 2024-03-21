import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Cliente } from 'src/app/model/cliente';
import { Usuario } from 'src/app/model/usuario';
import { ClienteService } from 'src/app/service/cliente.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component( {
  standalone: true,
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )
export class UserEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  hide = true;

  client: Cliente[];
  clientControl: FormControl = new FormControl();
  clientFiltered$: Observable<Cliente[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClienteService,
    private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup( {
      'idUserData': new FormControl( 0 ),
      'client': new FormControl( '', [Validators.required, Validators.minLength( 8 ), Validators.maxLength( 12 )] ),
      'identityType': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 40 )] ),
      'numberIdentity': new FormControl( '', [Validators.required, Validators.minLength( 7 ), Validators.maxLength( 12 )] ),
      'firstName': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'lastName': new FormControl( '', [Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'firstSurname': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'lastSurname': new FormControl( '', [Validators.minLength( 2 ), Validators.maxLength( 30 )] ),
      'telephone': new FormControl( '', [Validators.minLength( 6 ), Validators.maxLength( 9 )] ),
      'mobilePhone': new FormControl( '', [Validators.required, Validators.minLength( 10 ), Validators.maxLength( 10 )] ),
      'mail': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 30 )] ),
      'companyPosition': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'userName': new FormControl( '', [Validators.required, Validators.minLength( 6 ), Validators.maxLength( 12 )] ),
      'password': new FormControl( '', [Validators.required, Validators.minLength( 8 ), Validators.maxLength( 12 )] ),
      'privilege': new FormControl( '', [Validators.required, Validators.minLength( 4 ), Validators.maxLength( 20 )] ),
      'isActive': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 2 )] ),
    } );

    this.loadInitialData();
    this.clientFiltered$ = this.clientControl.valueChanges.pipe( map( val => this.filterClient( val ) ) );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
  }

  filterClient( val: any ): Cliente[] {
    if ( !val ) {
      return this.client;
    }

    if ( val?.idClient > 0 ) {
      return this.client.filter( el =>
        el.name.toLowerCase().includes( val.name.toLowerCase() ) );
    } else {
      return this.client.filter( el =>
        el.name.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }


  loadInitialData() {
    this.clientService.findAll().subscribe( data => this.client = data );
  }

  showClient( val: any ) {
    return val ? `${val.name}` : val;
  }


  initForm() {
    if ( this.isEdit ) {
      this.usuarioService.findById( this.id ).subscribe( data => {
        this.form.patchValue( {
          'idUserData': data.idUserData,
          'client': data.client,
          'identityType': data.identityType,
          'numberIdentity': data.numberIdentity,
          'firstName': data.firstName,
          'lastName': data.lastName,
          'firstSurname': data.firstSurname,
          'lastSurname': data.lastSurname,
          'telephone': data.telephone,
          'mobilePhone': data.mobilePhone,
          'mail': data.mail,
          'companyPosition': data.companyPosition,
          'userName': data.userName,
          'password': data.password,
          'privilege': data.privilege,
          'isActive': data.isActive

        } )

      } );
    }
  }

  operate() {
    if ( this.form.invalid ) { return; }

    let usuario = new Usuario();
    usuario.idUserData = this.form.value['idUserData'];
    usuario.client = this.form.value['client'];
    usuario.identityType = this.form.value['identityType'];
    usuario.numberIdentity = this.form.value['numberIdentity'];
    usuario.firstName = this.form.value['firstName'];
    usuario.lastName = this.form.value['lastName'];
    usuario.firstSurname = this.form.value['firstSurname'];
    usuario.lastSurname = this.form.value['lastSurname'];
    usuario.telephone = this.form.value['telephone'];
    usuario.mobilePhone = this.form.value['mobilePhone'];
    usuario.mail = this.form.value['mail'];
    usuario.companyPosition = this.form.value['companyPosition'];
    usuario.userName = this.form.value['userName'];
    usuario.password = this.form.value['password'];
    usuario.privilege = this.form.value['privilege'];
    usuario.isActive = this.form.value['isActive'];



    if ( this.isEdit ) {
      this.usuarioService.update( usuario.idUserData, usuario ).pipe( switchMap( () => {
        return this.usuarioService.findAll();
      } ) )
        .subscribe( data => {
          this.usuarioService.setUsuarioChange( data );
          this.usuarioService.setMessageChange( 'Usuario actualizado!' )

        } );
    } else {
      this.usuarioService.save( usuario ).pipe( switchMap( () => {
        return this.usuarioService.findAll();
      } ) )
        .subscribe( data => {
          this.usuarioService.setUsuarioChange( data );
          this.usuarioService.setMessageChange( "Usuario creado!" )
        } );
    }
    this.router.navigate( ['/pages/user'] );
  }


}