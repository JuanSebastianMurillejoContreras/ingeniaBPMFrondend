import { Routes } from '@angular/router';
import { CompanyTypeEditComponent } from './companytype/companytype-edit/companytype-edit.component';
import { CompanyTypeComponent } from './companytype/companytype.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClienteEditComponent } from './cliente/cliente-edit/cliente-edit.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { GlossaryEditComponent } from './glossary/glossary-edit/glossary-edit.component';
import { GeneralGoalService } from '../service/generalGoal.service';
import { GeneralGoalComponent } from './general-goal/general-goal.component';
import { GeneralGoalEditComponent } from './general-goal/general-goal-edit/general-goal-edit.component';
import { SpecificGoalComponent } from './specific-goal/specific-goal.component';
import { SpecificGoalEditComponent } from './specific-goal/specific-goal-edit/specific-goal-edit.component';



export const PagesRoutes: Routes = [
  {
    path: 'companytype',
    component: CompanyTypeComponent,
    children: [
      {
        path: 'new',
        component: CompanyTypeEditComponent,
      },
      {
        path: 'edit/:id',
        component: CompanyTypeEditComponent,
      },
    ],
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    children: [
      {
        path: 'new',
        component: ClienteEditComponent,
      },
      {
        path: 'edit/:id',
        component: ClienteEditComponent,
      },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: 'new',
        component: UserEditComponent,
      },
      {
        path: 'edit/:id',
        component: UserEditComponent,
      },
    ],
  },
  {
    path: 'glossary',
    component: GlossaryComponent,
    children: [
      {
        path: 'new',
        component: GlossaryEditComponent,
      },
      {
        path: 'edit/:id',
        component: GlossaryEditComponent,
      },
    ],
  },
  {
    path: 'generalgoal',
    component: GeneralGoalComponent,
    children: [
      {
        path: 'new',
        component: GeneralGoalEditComponent,
      },
      {
        path: 'edit/:id',
        component: GeneralGoalEditComponent,
      },
    ],
  },
  {
    path: 'specificgoal',
    component: SpecificGoalComponent,
    children: [
      {
        path: 'new',
        component: SpecificGoalEditComponent,
      },
      {
        path: 'edit/:id',
        component: SpecificGoalEditComponent,
      },
    ],
  }


];
