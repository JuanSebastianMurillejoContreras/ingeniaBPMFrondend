import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Variable } from 'src/app/model/variable';
import { VariableService } from 'src/app/service/variable.service';

@Component({
  selector: 'app-variable',
  standalone: true,
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class VariableComponent implements OnInit {

  displayedColumns: string[] = ['idVariable', 'variableName', 'actions'];
  dataSource: MatTableDataSource<Variable>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    this.variableService.getVariableChange().subscribe(data => {
      this.createTable(data);
    });

    this.variableService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.variableService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.variableService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.variableService.findAll();
    }))
    .subscribe(data => {
      this.variableService.setVariableChange(data);
      this.variableService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(variable: Variable[]){
    this.dataSource = new MatTableDataSource(variable);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}

