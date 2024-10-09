import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { ProcedureExecution } from 'src/app/model/ProcedureExecution';
import { ProcedureExecutionService } from 'src/app/service/procedure-execution.service';

@Component({
  selector: 'app-procedureexecution',
  standalone: true,
  templateUrl: './procedureexecution.component.html',
  styleUrls: ['./procedureexecution.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class ProcedureExecutionComponent implements OnInit{

  displayedColumns: string[] = ['idProcedureExecution', 'procedure', 'ExecutionDescription','actions'];
  dataSource: MatTableDataSource<ProcedureExecution>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private procedure: ProcedureExecutionService,
  ) { }

  ngOnInit(): void {
    this.procedure.getProcedureExecutionChange().subscribe(data => {
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

  delete(idProcedureExecution: number){
    this.procedure.delete(idProcedureExecution).pipe(switchMap( ()=> {
      return this.procedure.findAll();
    }))
    .subscribe(data => {
      this.procedure.setProcedureExecutionChange(data);
      this.procedure.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(procedure: ProcedureExecution[]){
    this.dataSource = new MatTableDataSource(procedure);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }


}
