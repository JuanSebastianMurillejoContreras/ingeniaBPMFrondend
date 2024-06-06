import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { TheoreticalFrameworkByProgramByCompanyType } from 'src/app/model/TheoreticalFrameworkByProgramByCompanyType';
import { TheoreticalFrameworkByProgramByCompanyTypeService } from 'src/app/service/theoretical-framework-by-program-by-company-type.service';

@Component({
  standalone:true,
  selector: 'app-theoretical-framework-by-program-by-company-type',
  templateUrl: './theoretical-framework-by-program-by-company-type.component.html',
  styleUrls: ['./theoretical-framework-by-program-by-company-type.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class TheoreticalFrameworkByProgramByCompanyTypeComponent implements OnInit{

  displayedColumns: string[] = ['idTheoreticalFrameworkByProgramByCompanyType', 'theoreticalFramework',  'program', 'companyType', 'actions'];
  dataSource: MatTableDataSource<TheoreticalFrameworkByProgramByCompanyType>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private theoreticalFrameworkByProgramByCompanyTypeService: TheoreticalFrameworkByProgramByCompanyTypeService
  ) { }

  ngOnInit(): void {
    this.theoreticalFrameworkByProgramByCompanyTypeService.getTheoreticalFrameworkByProgramByCompanyTypeChange().subscribe(data => {
      this.createTable(data);
    });

    this.theoreticalFrameworkByProgramByCompanyTypeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.theoreticalFrameworkByProgramByCompanyTypeService.findAll().subscribe(data => {
      this.createTable(data);
    });
 
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idTheoreticalFrameworkByProgramByCompanyType: number){
    this.theoreticalFrameworkByProgramByCompanyTypeService.delete(idTheoreticalFrameworkByProgramByCompanyType).pipe(switchMap( ()=> {
      return this.theoreticalFrameworkByProgramByCompanyTypeService.findAll();
    }))
    .subscribe(data => {
      this.theoreticalFrameworkByProgramByCompanyTypeService.setTheoreticalFrameworkByProgramByCompanyTypeChange(data);
      this.theoreticalFrameworkByProgramByCompanyTypeService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(theoreticalFrameworkByProgramByCompanyType: TheoreticalFrameworkByProgramByCompanyType[]){
    this.dataSource = new MatTableDataSource(theoreticalFrameworkByProgramByCompanyType);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }


  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

  
}

