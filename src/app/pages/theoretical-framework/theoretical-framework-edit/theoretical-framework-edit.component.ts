import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { TheoreticalFramework } from 'src/app/model/theoreticalFramework';
import { TheoreticalFrameworkService } from 'src/app/service/theoretical-framework.service';

@Component( {
  selector: 'app-theoretical-framework-edit',
  standalone: true,
  templateUrl: './theoretical-framework-edit.component.html',
  styleUrls: ['./theoretical-framework-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

} )
export class TheoreticalFrameworkEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private theoreticalFrameworkService: TheoreticalFrameworkService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      'idTheoreticalFramework': new FormControl( 0 ),
      'generalConsiderations': new FormControl( '', [Validators.required] ),
      'specificConsiderations': new FormControl( '', [Validators.required] ),
      'urlAnnexed': new FormControl( '', [Validators.required, Validators.minLength( 2 ), Validators.maxLength( 1200 )] )
    } );

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    } )

  }

  initForm() {
    if ( this.isEdit ) {
      this.theoreticalFrameworkService.findById( this.id ).subscribe( data => {
        this.form = new FormGroup( {
          'idTheoreticalFramework': new FormControl(data.idTheoreticalFramework),
          'generalConsiderations': new FormControl(data.generalConsiderations),
          'specificConsiderations': new FormControl(data.specificConsiderations),
          'urlAnnexed': new FormControl(data.urlAnnexed) 
        } );
    });
  }
}

  get f() {
  return this.form.controls;
}

operate() {
  if ( this.form.invalid ) { return; }
  let theoreticalFramework = new TheoreticalFramework();
  theoreticalFramework.idTheoreticalFramework = this.form.value['idTheoreticalFramework'];
  theoreticalFramework.generalConsiderations = this.form.value['generalConsiderations'];
  theoreticalFramework.specificConsiderations = this.form.value['specificConsiderations'];
  theoreticalFramework.urlAnnexed = this.form.value['urlAnnexed'];


  if ( this.isEdit ) {
    this.theoreticalFrameworkService.update( theoreticalFramework.idTheoreticalFramework, theoreticalFramework ).pipe( switchMap( () => {
      return this.theoreticalFrameworkService.findAll();
    } ) )
      .subscribe( data => {
        this.theoreticalFrameworkService.setTheoreticalFrameworkChange( data );
        this.theoreticalFrameworkService.setMessageChange( 'Consideraciones específicas actualizadas!' )

      } );
  } else {
    this.theoreticalFrameworkService.save( theoreticalFramework ).pipe( switchMap( () => {
      return this.theoreticalFrameworkService.findAll();
    } ) )
      .subscribe( data => {
        this.theoreticalFrameworkService.setTheoreticalFrameworkChange( data );
        this.theoreticalFrameworkService.setMessageChange( "Consideraciones específicas creadas!" )
      } );
  }
  this.router.navigate( ['/pages/theoreticalframework'] );
}

}
