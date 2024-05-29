import { Routes } from '@angular/router';
import { CompanyTypeEditComponent } from './companytype/companytype-edit/companytype-edit.component';
import { CompanyTypeComponent } from './companytype/companytype.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { GlossaryEditComponent } from './glossary/glossary-edit/glossary-edit.component';
import { GeneralGoalComponent } from './general-goal/general-goal.component';
import { GeneralGoalEditComponent } from './general-goal/general-goal-edit/general-goal-edit.component';
import { SpecificGoalComponent } from './specific-goal/specific-goal.component';
import { SpecificGoalEditComponent } from './specific-goal/specific-goal-edit/specific-goal-edit.component';
import { TheoreticalFrameworkComponent } from './theoretical-framework/theoretical-framework.component';
import { TheoreticalFrameworkEditComponent } from './theoretical-framework/theoretical-framework-edit/theoretical-framework-edit.component';
import { ProgramComponent } from './program/program.component';
import { ProgramEditComponent } from './program/program-edit/program-edit.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { ProgrambycompanyComponent } from './programbycompany/programbycompany.component';
import { ScopeComponent } from './scope/scope.component';
import { ScopeEditComponent } from './scope/scope-edit/scope-edit.component';
import { ProgrambycompanyEditComponent } from './programbycompany/programbycompany-edit/programbycompany-edit.component';
import { GlossaryByProgramByCompanyType } from '../model/GlossaryByProgramByCompanyType';
import { GlossarybyprogrambycompanytypeComponent } from './glossarybyprogrambycompanytype/glossarybyprogrambycompanytype.component';
import { GlossarybyprogrambycompanytypeEditComponent } from './glossarybyprogrambycompanytype/glossarybyprogrambycompanytype-edit/glossarybyprogrambycompanytype-edit.component';




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
    path: 'company',
    component: CompanyComponent,
    children: [
      {
        path: 'new',
        component: CompanyEditComponent,
      },
      {
        path: 'edit/:id',
        component: CompanyEditComponent,
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
    path: 'glossarybyprogrambycompanytype',
    component: GlossarybyprogrambycompanytypeComponent,
    children: [
      {
        path: 'new',
        component: GlossarybyprogrambycompanytypeEditComponent,
      },
      {
        path: 'edit/:id',
        component: GlossarybyprogrambycompanytypeEditComponent,
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
  },

  {
    path: 'theoreticalframework',
    component: TheoreticalFrameworkComponent,
    children: [
      {
        path: 'new',
        component: TheoreticalFrameworkEditComponent,
      },
      {
        path: 'edit/:id',
        component: TheoreticalFrameworkEditComponent,
      },
    ],
  },

  {
    path: 'program',
    component: ProgramComponent,
    children: [
      {
        path: 'new',
        component: ProgramEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProgramEditComponent,
      },
    ],
  },

  {
    path: 'scope',
    component: ScopeComponent,
    children: [
      {
        path: 'new',
        component: ScopeEditComponent,
      },
      {
        path: 'edit/:id',
        component: ScopeEditComponent,
      },
    ],
  },

  {
    path: 'programbycompany',
    component: ProgrambycompanyComponent,
    children: [
      {
        path: 'new',
        component: ProgrambycompanyEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProgrambycompanyEditComponent,
      },
    ],
  }



];
