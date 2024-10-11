import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { ProcedureExecutionByUtensilByProcedure } from 'src/app/model/ProcedureExecutionByUtensilByProcedure';
import { ProcedureExecutionByUtensilByProcedureService } from 'src/app/service/procedure-execution-by-utensil-by-procedure.service';

@Component({
  selector: 'app-procedure-execution-by-utensil-by-procedure',
  standalone: true,
  templateUrl: './procedure-execution-by-utensil-by-procedure.component.html',
  styleUrls: ['./procedure-execution-by-utensil-by-procedure.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class ProcedureExecutionByUtensilByProcedureComponent implements OnInit{

  displayedColumns: string[] = ['idProcedureExecutionByUtensilByProcedure', 'procedureExecution', 'utensilByProcedure','utensilUsed','actions'];
  dataSource: MatTableDataSource<ProcedureExecutionByUtensilByProcedure>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private procedureExecutionByVariableByProcedure: ProcedureExecutionByUtensilByProcedureService,
  ) { }

  ngOnInit(): void {
    this.procedureExecutionByVariableByProcedure.getProcedureExecutionByUtensilByProcedureChange().subscribe(data => {
      this.createTable(data);
    });

    this.procedureExecutionByVariableByProcedure.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.procedureExecutionByVariableByProcedure.findAll().subscribe(data => {
      this.createTable(data);
    });
 
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idProcedureExecutionByUtensilByProcedure: number){
    this.procedureExecutionByVariableByProcedure.delete(idProcedureExecutionByUtensilByProcedure).pipe(switchMap( ()=> {
      return this.procedureExecutionByVariableByProcedure.findAll();
    }))
    .subscribe(data => {
      this.procedureExecutionByVariableByProcedure.setProcedureExecutionByUtensilByProcedureChange(data);
      this.procedureExecutionByVariableByProcedure.setMessageChange('Eliminada!');
    })
    ;
  }

  createTable(procedureExecutionByVariableByProcedure: ProcedureExecutionByUtensilByProcedure[]){
    this.dataSource = new MatTableDataSource(procedureExecutionByVariableByProcedure);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }
}
