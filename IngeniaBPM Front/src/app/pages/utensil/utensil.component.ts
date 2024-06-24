import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Utensil } from 'src/app/model/Utensil';
import { UtensilService } from 'src/app/service/utensil.service';

@Component({
  selector: 'app-utensil',
  standalone: true,
  templateUrl: './utensil.component.html',
  styleUrls: ['./utensil.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class UtensilComponent implements OnInit {

  displayedColumns: string[] = ['idUtensil', 'utensilName', 'actions'];
  dataSource: MatTableDataSource<Utensil>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private utensilService: UtensilService
  ) { }

  ngOnInit(): void {
    this.utensilService.getUtensilChange().subscribe(data => {
      this.createTable(data);
    });

    this.utensilService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.utensilService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.utensilService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.utensilService.findAll();
    }))
    .subscribe(data => {
      this.utensilService.setUtensilChange(data);
      this.utensilService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(utensil: Utensil[]){
    this.dataSource = new MatTableDataSource(utensil);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}

