import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Procedure } from 'src/app/model/Procedure';
import { ProcedureService } from 'src/app/service/procedure.service';

@Component({
  selector: 'app-procedure',
  standalone: true,
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class ProcedureComponent  implements OnInit{

  displayedColumns: string[] = ['idProcedure', 'code', 'name','actions'];
  dataSource: MatTableDataSource<Procedure>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private procedure: ProcedureService,
  ) { }

  ngOnInit(): void {
    this.procedure.getProcedureChange().subscribe(data => {
      this.createTable(data);
    });

    this.procedure.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.procedure.findAll().subscribe(data => {
      this.createTable(data);
    });
 
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idProcedure: number){
    this.procedure.delete(idProcedure).pipe(switchMap( ()=> {
      return this.procedure.findAll();
    }))
    .subscribe(data => {
      this.procedure.setProcedureChange(data);
      this.procedure.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(procedure: Procedure[]){
    this.dataSource = new MatTableDataSource(procedure);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }
}