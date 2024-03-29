import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Company } from 'src/app/model/company';
import { Usuario } from 'src/app/model/usuario';
import { CompanyService } from 'src/app/service/company.service';
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

  company: Company[];
  companyControl: FormControl = new FormControl();
  companyFiltered$: Observable<Company[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private usuarioService: UsuarioService,
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup( {
      'idUserData': new FormControl( 0 ),
      'company': this.companyControl,
      'identityType': new FormControl( '', [Validators.required] ),
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
    this.companyFiltered$ = this.companyControl.valueChanges.pipe( map( val => this.filterCompany( val ) ) );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
  }

  filterCompany( val: any ): Company[] {
    if ( !val ) {
      return this.company;
    }

    if ( val?.idClient > 0 ) {
      return this.company.filter( el =>
        el.name.toLowerCase().includes( val.name.toLowerCase() ) );
    } else {
      return this.company.filter( el =>
        el.name.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }


  loadInitialData() {
    this.companyService.findAll().subscribe( data => this.company = data );
  }

  showCompany( val: any ) {
    return val ? `${val.name}` : val;
  }


  initForm() {
    if ( this.isEdit ) {
      this.usuarioService.findById( this.id ).subscribe( data => {
        this.form.setValue( {
          'idUserData': data.idUserData,
          'company': data.company,
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
          
        })
        console.log(data.identityType)
      } );
    }
  }

  operate() {
    if ( this.form.invalid ) { return; }

    let usuario = new Usuario();
    usuario.idUserData = this.form.value['idUserData'];
    usuario.company = this.form.value['company'];
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