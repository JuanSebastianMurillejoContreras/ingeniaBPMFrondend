import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CompanyType } from 'src/app/model/companyType';
import { CompanyTypeService } from 'src/app/service/companyType.service';


@Component({
  standalone: true,
  selector: 'app-companyType',
  templateUrl: './companytype.component.html',
  styleUrls: ['./companytype.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class CompanyTypeComponent implements OnInit {

  displayedColumns: string[] = ['idCompanyType', 'nameCompanyType', 'actions'];
  dataSource: MatTableDataSource<CompanyType>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private companyTypeService: CompanyTypeService
  ) { }

  ngOnInit(): void {
    this.companyTypeService.getCompanyTypeChange().subscribe(data => {
      this.createTable(data);
    });

    this.companyTypeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.companyTypeService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.companyTypeService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.companyTypeService.findAll();
    }))
    .subscribe(data => {
      this.companyTypeService.setCompanyTypeChange(data);
      this.companyTypeService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(companyType: CompanyType[]){
    this.dataSource = new MatTableDataSource(companyType);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}
