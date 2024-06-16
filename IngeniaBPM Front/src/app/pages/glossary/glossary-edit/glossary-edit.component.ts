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

  glossary: Glossary[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private glossaryService: GlossaryService,

  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idGlossary': new FormControl(0),
      'Word': new FormControl('', [Validators.required]),
      'definition': new FormControl('', [Validators.required]),
    });

    this.loadInitialData()

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
  }


  loadInitialData() {
    this.glossaryService.findAll().subscribe(data => this.glossary = data);
  }

  initForm() {
    if (this.isEdit) {
      this.glossaryService.findById(this.id).subscribe(data => {
        this.form.setValue({
          'idGlossary': data.idGlossary,
          'Word': data.word,
          'definition': data.definition,
        })
      })
    }
  }


  operate() {
    if (this.form.invalid) {
      return;
    }
    let glossaryService = new Glossary();
    glossaryService.idGlossary = this.form.value['idGlossary'];
    glossaryService.word = this.form.value['Word'];
    glossaryService.definition = this.form.value['definition']   


    if (this.isEdit) {
      this.glossaryService.update(glossaryService.idGlossary, glossaryService).pipe(switchMap(() => {
        return this.glossaryService.findAll();
      }))
        .subscribe(data => {
          this.glossaryService.setGlossaryChange(data);
          this.glossaryService.setMessageChange('Glosario Actualizado!')
        });

    } else {
      this.glossaryService.save(glossaryService).pipe(switchMap(() => {
        return this.glossaryService.findAll();
      }))
        .subscribe(data => {
          this.glossaryService.setGlossaryChange(data);
          this.glossaryService.setMessageChange("Glosario creado!")
        });
    }



    this.router.navigate(['/pages/glossary']);
  }

}


