import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { GeneralGoal } from 'src/app/model/generalGoal';
import { SpecificGoal } from 'src/app/model/specificGoal';
import { GeneralGoalService } from 'src/app/service/generalGoal.service';
import { SpecificGoalService } from 'src/app/service/specificGoal.service';

@Component({
  standalone: true,
  selector: 'app-specific-goal',
  templateUrl: './specific-goal.component.html',
  styleUrls: ['./specific-goal.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class SpecificGoalComponent implements OnInit {

  displayedColumns: string[] = ['idSpecificGoal', 'generalGoal', 'specificGoal','actions'];
  dataSource: MatTableDataSource<SpecificGoal>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private specificGoalService: SpecificGoalService
  ) { }

  ngOnInit(): void {
    this.specificGoalService.getSpecificGoalChange().subscribe(data => {
      this.createTable(data);
    });

    this.specificGoalService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.specificGoalService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(SpecificGoal: number){
    this.specificGoalService.delete(SpecificGoal).pipe(switchMap( ()=> {
      return this.specificGoalService.findAll();
    }))
    .subscribe(data => {
      this.specificGoalService.setSpecificGoalChange(data);
      this.specificGoalService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(specificGoal: SpecificGoal[]){
    this.dataSource = new MatTableDataSource(specificGoal);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}
