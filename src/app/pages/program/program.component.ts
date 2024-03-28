import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Program } from 'src/app/model/program';
import { ProgramService } from 'src/app/service/program.service';


@Component({
  selector: 'app-program',
  standalone: true,
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet]
})
export class ProgramComponent implements OnInit {

  displayedColumns: string[] = ['idProgram', "code", "name", 'scope', 'actions'];

  dataSource: MatTableDataSource<Program>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.programService.getProgramChange().subscribe( data => {
      this.createTable( data );
    } );

    this.programService.getMessageChange().subscribe( data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    } );

    this.programService.findAll().subscribe( data => {
      this.createTable( data );
    } );
  }

  applyFilter( e: any ) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete( idUsuario: number ) {
    this.programService.delete( idUsuario ).pipe( switchMap( () => {
      return this.programService.findAll();
    } ) )
      .subscribe( data => {
        this.programService.setProgramChange( data );
        this.programService.setMessageChange( 'Usuario eliminado!' );
      } );
  }

  createTable( program: Program[] ) {
    this.dataSource = new MatTableDataSource( program );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

}