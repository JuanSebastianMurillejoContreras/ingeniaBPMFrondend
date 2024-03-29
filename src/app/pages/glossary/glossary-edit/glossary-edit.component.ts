import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Glossary } from 'src/app/model/glossary';
import { GlossaryService } from 'src/app/service/glossary.service';

@Component({
  standalone: true,
  selector: 'app-glossary-edit',
  templateUrl: './glossary-edit.component.html',
  styleUrls: ['./glossary-edit.component.css'],

  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe, RouterLink, RouterOutlet]
})
export class GlossaryEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private glossaryService: GlossaryService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossary': new FormControl(0),
      'word': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'definition': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(1200)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.glossaryService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idGlossary': new FormControl(data.idGlossary),
          'word': new FormControl(data.word, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),    
          'definition': new FormControl(data.definition, [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]),    
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }
    let glossary = new Glossary();
    glossary.idGlossary = this.form.value['idGlossary'];
    glossary.word = this.form.value['word'];
    glossary.definition = this.form.value['definition'];
    

    if (this.isEdit) {
        this.glossaryService.update(glossary.idGlossary, glossary).pipe(switchMap(() => {
        return this.glossaryService.findAll();
    }))      
      .subscribe(data => {
          this.glossaryService.setGlossaryChange(data);
          this.glossaryService.setMessageChange('Palabra actualizada!')
     
      });
    } else {      
      this.glossaryService.save(glossary).pipe(switchMap(()=>{        
        return this.glossaryService.findAll();
      }))
      .subscribe(data => {
        this.glossaryService.setGlossaryChange(data);
        this.glossaryService.setMessageChange("Palabra creada!")
      });
    }
    this.router.navigate(['/pages/glossary']);
  }

}
