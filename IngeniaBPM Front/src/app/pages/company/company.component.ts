import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Company } from 'src/app/model/company';
import { CompanyService } from 'src/app/service/company.service';

@Component( {
  standalone: true,
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet]
} )
export class CompanyComponent {

  displayedColumns: string[] = ['idCompany', "nit", "name", "companyType", 'actions'];
  //"logoURL", "department", "city", "address", "mail", "phone", "numberEmployee", "size", "guarded" 

  dataSource: MatTableDataSource<Company>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.companyService.getCompanyChange().subscribe( data => {
      this.createTable( data );
    } );

    this.companyService.getMessageChange().subscribe( data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    } );

    this.companyService.findAll().subscribe( data => {
      this.createTable( data );
    } );
  }

  applyFilter( e: any ) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete( idCompany: number ) {
    this.companyService.delete( idCompany ).pipe( switchMap( () => {
      return this.companyService.findAll();
    } ) )
      .subscribe( data => {
        this.companyService.setCompanyChange( data );
        this.companyService.setMessageChange( 'Compañia eliminada!' );
      } )
      ;
  }

  createTable( company: Company[] ) {
    this.dataSource = new MatTableDataSource( company );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

}


