import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpecificGoalComponent } from './pages/specific-goal/specific-goal.component';
import { SpecificGoalEditComponent } from './pages/specific-goal/specific-goal-edit/specific-goal-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpecificGoalComponent,
    SpecificGoalEditComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
