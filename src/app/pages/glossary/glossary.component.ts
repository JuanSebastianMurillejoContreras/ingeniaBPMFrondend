import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GlossaryByProgramByCompanyType } from 'src/app/model/GlossaryByProgramByCompanyType';
import { GlossaryByProgramByCompanyTypeService } from 'src/app/service/glossary-by-program-by-company-type.service';

@Component({
  selector: 'app-glossary',
  standalone: true,
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class GlossaryComponent implements OnInit{

  displayedColumns: string[] = ['idGlossaryByProgramByCompanyType', 'glossary', 'program', 'companyType', 'actions'];
  dataSource: MatTableDataSource<GlossaryByProgramByCompanyType>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private glossaryByProgramByCompanyTypeService: GlossaryByProgramByCompanyTypeService
  ) { }

  ngOnInit(): void {
    this.glossaryByProgramByCompanyTypeService.getGlossaryByProgramByCompanyTypeChange().subscribe(data => {
      this.createTable(data);
    });

    this.glossaryByProgramByCompanyTypeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.glossaryByProgramByCompanyTypeService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idGlossaryByProgramByCompanyType: number){
    this.glossaryByProgramByCompanyTypeService.delete(idGlossaryByProgramByCompanyType).pipe(switchMap( ()=> {
      return this.glossaryByProgramByCompanyTypeService.findAll();
    }))
    .subscribe(data => {
      this.glossaryByProgramByCompanyTypeService.setGlossaryByProgramByCompanyTypeChange(data);
      this.glossaryByProgramByCompanyTypeService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(glossaryByProgramByCompanyType: GlossaryByProgramByCompanyType[]){
    this.dataSource = new MatTableDataSource(glossaryByProgramByCompanyType);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }


}
