import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { CompanyTypeService } from 'src/app/service/companyType.service';

@Component({
  standalone: true,
  selector: 'app-companyype-edit',
  templateUrl: './companytype-edit.component.html',
  styleUrls: ['./companytype-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class CompanyTypeEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyTypeService: CompanyTypeService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idCompanyType': new FormControl(0),
      'nameCompanyType': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.companyTypeService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idCompanyType': new FormControl(data.idCompanyType),
          'nameCompanyType': new FormControl(data.nameCompanyType, [Validators.required, Validators.minLength(2), Validators.maxLength(30)
            
          ]),    
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }
    let companyType = new CompanyType();
    companyType.idCompanyType = this.form.value['idCompanyType'];
    companyType.nameCompanyType = this.form.value['nameCompanyType'];
    

    if (this.isEdit) {
        this.companyTypeService.update(companyType.idCompanyType, companyType).pipe(switchMap(() => {
        return this.companyTypeService.findAll();
    }))      
      .subscribe(data => {
          this.companyTypeService.setCompanyTypeChange(data);
          this.companyTypeService.setMessageChange('TIPO DE COMPAÑÍA ACTUALIZADA!')
     
      });
    } else {      
      this.companyTypeService.save(companyType).pipe(switchMap(()=>{        
        return this.companyTypeService.findAll();
      }))
      .subscribe(data => {
        this.companyTypeService.setCompanyTypeChange(data);
        this.companyTypeService.setMessageChange("TIPO DE COMPAÑÍA CREADA!")
      });
    }
    this.router.navigate(['/pages/companytype']);
  }

}
