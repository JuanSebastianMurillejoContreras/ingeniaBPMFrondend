import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { TheoreticalFramework } from 'src/app/model/theoreticalFramework';
import { TheoreticalFrameworkService } from 'src/app/service/theoretical-framework.service';

@Component({
  selector: 'app-theoretical-framework',
  standalone: true,
  templateUrl: './theoretical-framework.component.html',
  styleUrls: ['./theoretical-framework.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class TheoreticalFrameworkComponent implements OnInit {

  displayedColumns: string[] = ['idTheoreticalFramework', 'generalConsiderations', 'actions'];
  dataSource: MatTableDataSource<TheoreticalFramework>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private theoreticalFrameworkService: TheoreticalFrameworkService
  ) { }

  ngOnInit(): void {
    this.theoreticalFrameworkService.getTheoreticalFrameworkChange().subscribe(data => {
      this.createTable(data);
    });

    this.theoreticalFrameworkService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.theoreticalFrameworkService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idTheoreticalFramework: number){
    this.theoreticalFrameworkService.delete(idTheoreticalFramework).pipe(switchMap( ()=> {
      return this.theoreticalFrameworkService.findAll();
    }))
    .subscribe(data => {
      this.theoreticalFrameworkService.setTheoreticalFrameworkChange(data);
      this.theoreticalFrameworkService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(theoreticalFramework: TheoreticalFramework[]){
    this.dataSource = new MatTableDataSource(theoreticalFramework);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}
