import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { ProgramByCompany } from 'src/app/model/programbyCompany';
import { ProgrambycompanyService } from 'src/app/service/programbycompany.service';

@Component({
  selector: 'app-programbycompany',
  standalone: true,
  templateUrl: './programbycompany.component.html',
  styleUrls: ['./programbycompany.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet]
})
export class ProgrambycompanyComponent {

  displayedColumns: string[] = ['idProgramByCompany', "program", "company", 'actions'];
  dataSource: MatTableDataSource<ProgramByCompany>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private programByCompanyService: ProgrambycompanyService
  ) { }

  ngOnInit(): void {
    this.programByCompanyService.getProgramByCompanyChange().subscribe( data => {
      this.createTable( data );
    } );

    this.programByCompanyService.getMessageChange().subscribe( data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    } );

    this.programByCompanyService.findAll().subscribe( data => {
      this.createTable( data );
    } );
  }

  applyFilter( e: any ) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete( idProgramByCompany: number ) {
    this.programByCompanyService.delete( idProgramByCompany ).pipe( switchMap( () => {
      return this.programByCompanyService.findAll();
    } ) )
      .subscribe( data => {
        this.programByCompanyService.setProgramByCompanyChange( data );
        this.programByCompanyService.setMessageChange( 'Compañia eliminada!' );
      } )
      ;
  }

  createTable( programByCompany: ProgramByCompany[] ) {
    this.dataSource = new MatTableDataSource( programByCompany );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

}




