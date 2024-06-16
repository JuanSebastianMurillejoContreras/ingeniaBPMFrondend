import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoalByProgramByCompanyType } from 'src/app/model/generalGoalByProgramByCompanyType';
import { GeneralGoalByProgramByCompanyTypeService } from 'src/app/service/general-goal-by-program-by-company-type.service';

@Component({
  standalone: true,
  selector: 'app-general-goal-by-program-by-company-type',
  templateUrl: './general-goal-by-program-by-company-type.component.html',
  styleUrls: ['./general-goal-by-program-by-company-type.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
  
})
export class GeneralGoalByProgramByCompanyTypeComponent implements OnInit{

  displayedColumns: string[] = ['idGeneralGoalByProgramByCompanyType', 'generalGoal', 'program', 'companyType', 'actions'];
  dataSource: MatTableDataSource<GeneralGoalByProgramByCompanyType>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private generalGoalByProgramByCompanyTypeService: GeneralGoalByProgramByCompanyTypeService,
  ) { }

  ngOnInit(): void {
    this.generalGoalByProgramByCompanyTypeService.getGeneralGoalByProgramByCompanyTypeChange().subscribe(data => {
      this.createTable(data);
    });

    this.generalGoalByProgramByCompanyTypeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.generalGoalByProgramByCompanyTypeService.findAll().subscribe(data => {
      this.createTable(data);
    });
 
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idGeneralGoalByProgramByCompanyType: number){
    this.generalGoalByProgramByCompanyTypeService.delete(idGeneralGoalByProgramByCompanyType).pipe(switchMap( ()=> {
      return this.generalGoalByProgramByCompanyTypeService.findAll();
    }))
    .subscribe(data => {
      this.generalGoalByProgramByCompanyTypeService.setGeneralGoalByProgramByCompanyTypeChange(data);
      this.generalGoalByProgramByCompanyTypeService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(generalGoalByProgramByCompanyTypeService: GeneralGoalByProgramByCompanyType[]){
    this.dataSource = new MatTableDataSource(generalGoalByProgramByCompanyTypeService);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }


  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

   
}
