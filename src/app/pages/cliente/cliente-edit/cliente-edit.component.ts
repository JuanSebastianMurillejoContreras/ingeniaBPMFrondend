import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Cliente } from 'src/app/model/cliente';
import { CompanyType } from 'src/app/model/companyType';
import { ClienteService } from 'src/app/service/cliente.service';
import { CompanyTypeService } from 'src/app/service/companyType.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private companyTypeService: CompanyTypeService,
    private _snackBar: MatSnackBar
  ) { }


  
  ngOnInit(): void {
    this.form = new FormGroup( {
      'idClient': new FormControl( 0 ),
      'nit': new FormControl( '', [Validators.required, Validators.minLength( 8 ), Validators.maxLength( 12 )] ),
      'name': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 40 )] ),
      'companyType': this.companyTypeControl

    } );

    this.loadInitialData();
    this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe( map( val => this.filterCompanyType( val ) ) );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
  }

  filterCompanyType(val: any): CompanyType[] {
    if (!val) {
      return this.companyTypes;
    }

    if (val?.idCompanyType > 0) {
      return this.companyTypes.filter(el =>
        el.nameCompanyType.toLowerCase().includes(val.nameCompanyType.toLowerCase()));
    } else {
      return this.companyTypes.filter(el =>
        el.nameCompanyType.toLowerCase().includes(val?.toLowerCase()));
    }
  }

  loadInitialData() {
    this.companyTypeService.findAll().subscribe( data => this.companyTypes = data );
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }

  initForm() {
    if (this.isEdit) {
      this.clienteService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idClient': data.idClient,
          'nit': data.nit,
          'name': data.name,
          'companyType': data.companyType
        })
      });
    }
  }

  /*initForm() {
    if (this.isEdit) {
      this.clienteService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idClient': new FormControl(data.idClient),
          'nit': new FormControl(data.nit),
          'name': new FormControl(data.name),
          'companyType':new FormControl(data.companyType),
        })
      });
    }
  }*/



  get a() {
    return this.form.controls;
  }



  get f() {
    return this.form.controls;
  }

  operate() {
    if ( this.form.invalid ) { return; }

    let cliente = new Cliente();
    cliente.idClient = this.form.value['idCompanyType'];
    cliente.companyType = this.form.value['companyType'];


    if ( this.isEdit ) {
      this.clienteService.update( cliente.idClient, cliente ).pipe( switchMap( () => {
        return this.clienteService.findAll();
      } ) )
        .subscribe( data => {
          this.clienteService.setClienteChange( data );
          this.clienteService.setMessageChange( 'TIPO DE CLIENTE ACTUALIZADO!' )

        } );
    } else {
      this.clienteService.save( cliente ).pipe( switchMap( () => {
        return this.clienteService.findAll();
      } ) )
        .subscribe( data => {
          this.clienteService.setClienteChange( data );
          this.clienteService.setMessageChange( "TIPO DE CLIENTE CREADO!" )
        } );
    }
    this.router.navigate( ['/pages/cliente'] );
  }
}