import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';

@Component({
  selector: 'app-general-goal-edit',
  standalone: true,
  templateUrl: './general-goal-edit.component.html',
  styleUrls: ['./general-goal-edit.component.css'],


  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class GeneralGoalEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalGoalService: GeneralGoalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGeneralGoal': new FormControl(0),
      'generalGoal': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.generalGoalService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idGeneralGoal': new FormControl(data.idGeneralGoal),
          'generalGoal': new FormControl(data.generalGoal, [Validators.required, Validators.minLength(2), Validators.maxLength(1200)
            
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
    let companyType = new GeneralGoal();
    companyType.idGeneralGoal = this.form.value['idGeneralGoal'];
    companyType.generalGoal = this.form.value['generalGoal'];
    

    if (this.isEdit) {
        this.generalGoalService.update(companyType.idGeneralGoal, companyType).pipe(switchMap(() => {
        return this.generalGoalService.findAll();
    }))      
      .subscribe(data => {
          this.generalGoalService.setGeneralGoalChange(data);
          this.generalGoalService.setMessageChange('Objetivo general actualizado!')
     
      });
    } else {      
      this.generalGoalService.save(companyType).pipe(switchMap(()=>{        
        return this.generalGoalService.findAll();
      }))
      .subscribe(data => {
        this.generalGoalService.setGeneralGoalChange(data);
        this.generalGoalService.setMessageChange("Objetivo general creado!")
      });
    }
    this.router.navigate(['/pages/generalgoal']);
  }

}
