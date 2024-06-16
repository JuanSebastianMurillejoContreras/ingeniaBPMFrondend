import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Company } from 'src/app/model/company';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet]
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['idUserData', "company", "numberIdentity", "firstName", "lastName", "firstSurname", "lastSurname", "userName", 'actions'];

  dataSource: MatTableDataSource<Usuario>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;

  company: Company;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioChange().subscribe( data => {
      this.createTable( data );
    } );

    this.usuarioService.getMessageChange().subscribe( data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    } );

    this.usuarioService.findAll().subscribe( data => {
      this.createTable( data );
    } );
  }

  applyFilter( e: any ) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete( idUsuario: number ) {
    this.usuarioService.delete( idUsuario ).pipe( switchMap( () => {
      return this.usuarioService.findAll();
    } ) )
      .subscribe( data => {
        this.usuarioService.setUsuarioChange( data );
        this.usuarioService.setMessageChange( 'Usuario eliminado!' );
      } );
  }

  createTable( usuario: Usuario[] ) {
    this.dataSource = new MatTableDataSource( usuario );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

}