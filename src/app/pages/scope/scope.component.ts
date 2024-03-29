import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { Scope } from 'src/app/model/scope';
import { ScopeService } from 'src/app/service/scope.service';

@Component({
  selector: 'app-scope',
  standalone: true,
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class ScopeComponent implements OnInit {

  displayedColumns: string[] = ['idScope', 'definitionScope', 'actions'];
  dataSource: MatTableDataSource<Scope>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private scopeService: ScopeService
  ) { }

  ngOnInit(): void {
    this.scopeService.getScopeChange().subscribe(data => {
      this.createTable(data);
    });

    this.scopeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.scopeService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.scopeService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.scopeService.findAll();
    }))
    .subscribe(data => {
      this.scopeService.setScopeChange(data);
      this.scopeService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(scope: Scope[]){
    this.dataSource = new MatTableDataSource(scope);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}

