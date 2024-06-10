import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal, SpecificGoal } from 'src/app/model/generalGoal';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { SpecificGoalService } from 'src/app/service/specific-goal.service';

@Component({
  selector: 'app-general-goal-edit',
  standalone: true,
  templateUrl: './general-goal-edit.component.html',
  styleUrls: ['./general-goal-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]

})export class GeneralGoalEditComponent implements OnInit {
  id: number;
  isEdit: boolean;
  form: FormGroup;
  idsToDelete: number[] = [];  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private generalGoalService: GeneralGoalService,
    private specificGoalService: SpecificGoalService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idGeneralGoal: [0],
      generalGoal: ['', Validators.required],
      lstSpecificGoal: this.fb.array([])  
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.generalGoalService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idGeneralGoal: data.idGeneralGoal,
          generalGoal: data.generalGoal
        });
        this.setSpecificGoals(data.lstSpecificGoal.reverse());
      });
    }
  }

  setSpecificGoals(specificGoal: SpecificGoal[]) {
    const lstSpecificGoal = this.form.get('lstSpecificGoal') as FormArray;
    specificGoal.forEach(goal => {
      lstSpecificGoal.push(this.fb.group({
        idSpecificGoal: [goal.idSpecificGoal],
        specificGoal: [goal.specificGoal, Validators.required]
      }));
    });
  }

  get specificGoals() {
    return this.form.get('lstSpecificGoal') as FormArray;
  }

  addSpecificGoal() {
    this.specificGoals.push(this.fb.group({
      idSpecificGoal: [0],
      specificGoal: ['', Validators.required]
    }));
  }

  removeSpecificGoal(index: number) {
    const goal = this.specificGoals.at(index).value;
    if (goal.idSpecificGoal) {
      this.idsToDelete.push(goal.idSpecificGoal); 
    }
    this.specificGoals.removeAt(index);
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const generalGoal: GeneralGoal = this.form.value;

    const deleteSpecificGoals = this.idsToDelete.map(id => this.specificGoalService.delete(id));

    if (deleteSpecificGoals.length > 0) {
      forkJoin(deleteSpecificGoals).pipe(
        switchMap(() => {
          return this.saveOrUpdateGeneralGoal(generalGoal);
        })
      ).subscribe(() => {
        this.navigateToGeneralGoalList();
      });
    } else {
      this.saveOrUpdateGeneralGoal(generalGoal).subscribe(() => {
        this.navigateToGeneralGoalList();
      });
    }
  }

  saveOrUpdateGeneralGoal(generalGoal: GeneralGoal): Observable<any> {
    if (this.isEdit) {
      return this.generalGoalService.update(generalGoal.idGeneralGoal, generalGoal).pipe(
        switchMap(() => this.generalGoalService.findAll()),
        tap(data => {
          this.generalGoalService.setGeneralGoalChange(data);
          this.generalGoalService.setMessageChange('Objetivos actualizados!');
        })
      );
    } else {
      return this.generalGoalService.save(generalGoal).pipe(
        switchMap(() => this.generalGoalService.findAll()),
        tap(data => {
          this.generalGoalService.setGeneralGoalChange(data);
          this.generalGoalService.setMessageChange('Objetivos creados!');
        })
      );
    }
  }

  navigateToGeneralGoalList() {
    this.router.navigate(['/pages/generalgoal']);
  }
}