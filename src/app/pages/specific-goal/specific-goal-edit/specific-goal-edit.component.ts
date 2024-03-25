import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { MatCardModule } from '@angular/material/card';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { SpecificGoalService } from 'src/app/service/specificGoal.service';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { generate, switchMap } from 'rxjs';
import { SpecificGoal } from 'src/app/model/specificGoal';

@Component( {
  standalone: true,
  selector: 'app-specific-goal-edit',
  templateUrl: './specific-goal-edit.component.html',
  styleUrls: ['./specific-goal-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, MatCardModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
} )
export class SpecificGoalEditComponent implements OnInit {


  id: number;
  isEdit: boolean;
  form: FormGroup;

  generalGoal: GeneralGoal;
  idgeneralGoal: number;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specificGoalService: SpecificGoalService,
    private generalGoalService: GeneralGoalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idSpecificGoal': new FormControl(0),
      'specificGoal': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.specificGoalService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSpecificGoal': new FormControl(data.idSpecificGoal),
          'specificGoal': new FormControl(data.specificGoal, [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]),    
        });
         // Obtener el generalGoal correspondiente
         this.generalGoalService.findById(data.generalGoal.idGeneralGoal).subscribe(generalGoal => {
          this.idgeneralGoal = generalGoal.idGeneralGoal;
          this.generalGoal = generalGoal;

      });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }
    let specificGoal = new SpecificGoal();
    specificGoal.idSpecificGoal = this.form.value['idSpecificGoal'];
    specificGoal.generalGoal = this.generalGoal;        
    specificGoal.specificGoal = this.form.value['specificGoal'];
    

    if (this.isEdit) {
        this.specificGoalService.update(specificGoal.idSpecificGoal, specificGoal).pipe(switchMap(() => {
        return this.specificGoalService.findAll();
    }))      
      .subscribe(data => {
          this.specificGoalService.setSpecificGoalChange(data);
          this.specificGoalService.setMessageChange('Objetivo específico actualizado!')
     
      });
    } else {      
      this.specificGoalService.save(specificGoal).pipe(switchMap(()=>{        
        return this.specificGoalService.findAll();
      }))
      .subscribe(data => {
        this.specificGoalService.setSpecificGoalChange(data);
        this.specificGoalService.setMessageChange("Objetivo específico creado!")
      });
    }
    this.router.navigate(['/pages/specificgoal']);
  }

}