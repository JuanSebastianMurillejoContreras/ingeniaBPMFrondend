import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, map, startWith, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Company } from 'src/app/model/company';
import { CompanyType } from 'src/app/model/companyType';
import { CompanyService } from 'src/app/service/company.service';
import { CompanyTypeService } from 'src/app/service/companyType.service';

@Component( {
  standalone: true,
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )

export class CompanyEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  companyType: CompanyType[];
  companyTypeControl: FormControl = new FormControl();
  companyTypeFiltered$: Observable<CompanyType[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private companyTypeService: CompanyTypeService,
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup( {
      'idCompany': new FormControl( 0 ),
      'nit': new FormControl( '', [Validators.required, Validators.minLength( 8 ), Validators.maxLength( 12 )] ),
      'name': new FormControl( '', [Validators.required] ),
      'companyType': this.companyTypeControl,
      'department': new FormControl( '', [Validators.required] ),
      'city': new FormControl( '', [Validators.required] ),
      'address': new FormControl( '', [Validators.required] ),
      'mail': new FormControl( '', [Validators.required] ),
      'phone': new FormControl( '', [Validators.required] ),
      'numberEmployee': new FormControl( '', [Validators.required] ),
      'size': new FormControl( '', [Validators.required] ),
      'guarded': new FormControl( '', [Validators.required] ),
      'logoURL': new FormControl( '', [Validators.required] ),
    } );

    this.loadInitialData();
    this.companyTypeFiltered$ = this.companyTypeControl.valueChanges.pipe(startWith(''), map( val => this.filterCompanyType( val ) ) );

     this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )
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
    this.companyTypeService.findAll().subscribe( data => this.companyType = data );
  }

  showCompanyType( val: any ) {
    return val ? `${val.nameCompanyType}` : val;
  }



  initForm() {
    if ( this.isEdit ) {
      this.companyService.findById( this.id ).subscribe( data => {
        this.form.setValue( {
          'idCompany': data.idCompany,
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
        } );

      } );
    }
  }

  operate() {
    if ( this.form.invalid ) { return; }

    let company = new Company();
    company.idCompany = this.form.value['idCompany'];
    company.nit = this.form.value['nit'];
    company.name = this.form.value['name'];
    company.companyType = this.form.value['companyType'];
    company.department = this.form.value['department'];
    company.city = this.form.value['city'];
    company.address = this.form.value['address'];
    company.mail = this.form.value['mail'];
    company.phone = this.form.value['phone'];
    company.numberEmployee = this.form.value['numberEmployee'];
    company.size = this.form.value['size'];
    company.guarded = this.form.value['guarded'];
    company.logoURL = this.form.value['logoURL'];

    if ( this.isEdit ) {
      this.companyService.update( company.idCompany, company ).pipe( switchMap( () => {
        return this.companyService.findAll();
      } ) )
        .subscribe( data => {
          this.companyService.setCompanyChange( data );
          this.companyService.setMessageChange( 'Compañía actualizada!' )

        } );
    } else {
      this.companyService.save( company ).pipe( switchMap( () => {
        return this.companyService.findAll();
      } ) )
        .subscribe( data => {
          this.companyService.setCompanyChange( data );
          this.companyService.setMessageChange( "Compañia creada!" )          
        } );              
    }
    this.router.navigate( ['/pages/company'] );  
  }

}


