import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Supplies } from 'src/app/model/Supplies';
import { SuppliesService } from 'src/app/service/supplies.service';

@Component({
  selector: 'app-supplies',
  standalone: true,
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class SuppliesComponent implements OnInit {

  displayedColumns: string[] = ['idSupplies', 'suppliesName', 'actions'];
  dataSource: MatTableDataSource<Supplies>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private suppliesService: SuppliesService
  ) { }

  ngOnInit(): void {
    this.suppliesService.getSuppliesChange().subscribe(data => {
      this.createTable(data);
    });

    this.suppliesService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.suppliesService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idCompanyType: number){
    this.suppliesService.delete(idCompanyType).pipe(switchMap( ()=> {
      return this.suppliesService.findAll();
    }))
    .subscribe(data => {
      this.suppliesService.setSuppliesChange(data);
      this.suppliesService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(supplies: Supplies[]){
    this.dataSource = new MatTableDataSource(supplies);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }

  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

}

