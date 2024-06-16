import { NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive, NgIf]
})
export class LayoutComponent {

  panelOpenState = false;
}
