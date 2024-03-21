import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';

@Component({
  standalone: true,
  selector: 'app-general-goal',
  templateUrl: './general-goal.component.html',
  styleUrls: ['./general-goal.component.css'],

  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class GeneralGoalComponent implements OnInit {

  displayedColumns: string[] = ['idGeneralGoal', 'generalGoal', 'actions'];
  dataSource: MatTableDataSource<GeneralGoal>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private generalGoalService: GeneralGoalService
  ) { }

  ngOnInit(): void {
    this.generalGoalService.getGeneralGoalChange().subscribe(data => {
      this.createTable(data);
    });

    this.generalGoalService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.generalGoalService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.generalGoalService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.generalGoalService.findAll();
    }))
    .subscribe(data => {
      this.generalGoalService.setGeneralGoalChange(data);
      this.generalGoalService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(generalGoal: GeneralGoal[]){
    this.dataSource = new MatTableDataSource(generalGoal);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}
