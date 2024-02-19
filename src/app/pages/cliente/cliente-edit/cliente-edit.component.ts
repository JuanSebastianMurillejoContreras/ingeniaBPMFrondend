import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, isEmpty, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Cliente } from 'src/app/model/cliente';
import { CompanyType } from 'src/app/model/companyType';
import { Department } from 'src/app/model/department';
import { ClienteService } from 'src/app/service/cliente.service';
import { CompanyTypeService } from 'src/app/service/companyType.service';
import { DepartmentService } from 'src/app/service/departments.service';

@Component( {
  standalone: true,
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )


export class ClienteEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  companyTypes: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  /*departments: Department[];
  departmentsControl: FormControl = new FormControl();
  departmentFiltered$: Observable<Department[]>;*/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private companyTypeService: CompanyTypeService,
    //private departmentService: DepartmentService,
    private _snackBar: MatSnackBar
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup( {
      'idClient': new FormControl( 0 ),
      'nit': new FormControl( '', [Validators.required, Validators.minLength( 8 ), Validators.maxLength( 12 )] ),
      'name': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 40 )] ),
      'companyType': this.companyTypeControl,
      'department': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'city': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'address': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'mail': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 30 )] ),
      'phone': new FormControl( '', [Validators.required, Validators.minLength( 9 ), Validators.maxLength( 12 )] ),
      'numberEmployee ': new FormControl( '', [Validators.required, Validators.minLength( 1 ), Validators.maxLength( 5 )] ),
      'size': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 10 )] ),
      'guarded': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 20 )] ),
      'logoURL': new FormControl( '', [Validators.required, Validators.minLength( 1 ), Validators.maxLength( 80 )] ),
    } );

    this.loadInitialData();
    this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe( map( val => this.filterCompanyType( val ) ) );
    //this.departmentFiltered$ = this.departmentsControl.valueChanges.pipe( map( val => //this.filterDepartment( val ) ) );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
  }

  filterCompanyType( val: any ): CompanyType[] {
    if ( !val ) {
      return this.companyTypes;
    }

    if ( val?.idCompanyType > 0 ) {
      return this.companyTypes.filter( el =>
        el.nameCompanyType.toLowerCase().includes( val.nameCompanyType.toLowerCase() ) );
    } else {
      return this.companyTypes.filter( el =>
        el.nameCompanyType.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }

  /*filterDepartment( val: any ) {
      if ( val?.departamento == null) {
      return this.departments.filter( el =>
        el.departamento.toLowerCase().includes( val.departamento.toLowerCase() ) );
    } else {
      return this.departments.filter( el =>
        el.departamento.toLowerCase().includes( val?.toLowerCase() ) );
    }
  }*/

  loadInitialData() {
    this.companyTypeService.findAll().subscribe( data => this.companyTypes = data );
    //this.departmentService.findAll().subscribe( data => this.departments = data );
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }

  /*showDepartment( val: any ) {
    return val ? `${val.departamento}` : val;
  }*/

  initForm() {
    if ( this.isEdit ) {
      this.clienteService.findById( this.id ).subscribe( data => {
        this.form.setValue( {
          'idClient': data.idClient,
          'nit': data.nit,
          'name': data.name,
          'companyType': data.companyType,
          'department': data.department,
          'city': data.city,
          'address': data.address,
          'mail': data.mail,
          'phone': data.phone,
          'numberEmployee': data.numberEmployee,
          'size': data.size,
          'guarded': data.guarded,
          'logoURL': data.logoURL

        } )
      } );
    }
  }

  get a() {
    return this.form.controls;
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if ( this.form.invalid ) { return; }

    let cliente = new Cliente();
    cliente.idClient = this.form.value['idClient'];
    cliente.nit = this.form.value['nit'];
    cliente.companyType = this.form.value['companyType'];
    cliente.department = this.form.value['department'];
    cliente.city = this.form.value['city'];
    cliente.address = this.form.value['address'];
    cliente.mail = this.form.value['mail'];
    cliente.phone = this.form.value['phone'];
    cliente.numberEmployee = this.form.value['numberEmployee'];
    cliente.size = this.form.value['size'];
    cliente.guarded = this.form.value['guarded'];

    if ( this.isEdit ) {
      this.clienteService.update( cliente.idClient, cliente ).pipe( switchMap( () => {
        return this.clienteService.findAll();
      } ) )
        .subscribe( data => {
          this.clienteService.setClienteChange( data );
          this.clienteService.setMessageChange( 'Cliente actualizado!' )

        } );
    } else {
      this.clienteService.save( cliente ).pipe( switchMap( () => {
        return this.clienteService.findAll();
      } ) )
        .subscribe( data => {
          this.clienteService.setClienteChange( data );
          this.clienteService.setMessageChange( "Cliente creado!" )
        } );
    }
    this.router.navigate( ['/pages/cliente'] );
  }


}