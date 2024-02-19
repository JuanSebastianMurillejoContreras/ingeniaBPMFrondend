import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';

@Component( {
  standalone: true,
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet]
} )
export class ClienteComponent {

  displayedColumns: string[] = ['idClient', "nit", "name", "companyType", 'actions'];
  //"logoURL", "department", "city", "address", "mail", "phone", "numberEmployee", "size", "guarded", "recordingDate", "recordedUser", 

  dataSource: MatTableDataSource<Cliente>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.clienteService.getClienteChange().subscribe( data => {
      this.createTable( data );
    } );

    this.clienteService.getMessageChange().subscribe( data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    } );

    this.clienteService.findAll().subscribe( data => {
      this.createTable( data );
    } );
  }

  applyFilter( e: any ) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete( idCliente: number ) {
    this.clienteService.delete( idCliente ).pipe( switchMap( () => {
      return this.clienteService.findAll();
    } ) )
      .subscribe( data => {
        this.clienteService.setClienteChange( data );
        this.clienteService.setMessageChange( 'Cliente eliminado!' );
      } )
      ;
  }

  createTable( cliente: Cliente[] ) {
    this.dataSource = new MatTableDataSource( cliente );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(): boolean {
    return this.route.children.length > 0;
  }

}


