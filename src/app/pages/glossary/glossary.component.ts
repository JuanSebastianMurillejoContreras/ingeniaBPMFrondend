import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Glossary } from 'src/app/model/glossary';
import { GlossaryService } from 'src/app/service/glossary.service';

@Component({
  selector: 'app-glossary',
  standalone: true,
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class GlossaryComponent implements OnInit{

  displayedColumns: string[] = ['idGlossary', 'word', 'definition','actions'];
  dataSource: MatTableDataSource<Glossary>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private glossaryService: GlossaryService,
  ) { }

  ngOnInit(): void {
    this.glossaryService.getGlossaryChange().subscribe(data => {
      this.createTable(data);
    });

    this.glossaryService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: "bottom", horizontalPosition: "right" });
    });

    this.glossaryService.findAll().subscribe(data => {
      this.createTable(data);
    });
 
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idGlossary: number){
    this.glossaryService.delete(idGlossary).pipe(switchMap( ()=> {
      return this.glossaryService.findAll();
    }))
    .subscribe(data => {
      this.glossaryService.setGlossaryChange(data);
      this.glossaryService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(glossary: Glossary[]){
    this.dataSource = new MatTableDataSource(glossary);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;        
  }


  checkChildren(): boolean{
    return this.route.children.length > 0;
  }

  

}
