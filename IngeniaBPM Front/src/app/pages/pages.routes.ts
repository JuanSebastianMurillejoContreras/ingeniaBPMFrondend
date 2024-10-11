import { Routes } from '@angular/router';
import { CompanyTypeEditComponent } from './companytype/companytype-edit/companytype-edit.component';
import { CompanyTypeComponent } from './companytype/companytype.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { GlossaryEditComponent } from './glossary/glossary-edit/glossary-edit.component';
import { GeneralGoalComponent } from './general-goal/general-goal.component';
import { GeneralGoalEditComponent } from './general-goal/general-goal-edit/general-goal-edit.component';
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
import { ProcedureComponent } from './procedure/procedure.component';
import { ProcedureEditComponent } from './procedure/procedure-edit/procedure-edit.component';
import { VariableComponent } from './variable/variable.component';
import { VariableEditComponent } from './variable/variable-edit/variable-edit.component';
import { UtensilComponent } from './utensil/utensil.component';
import { UtensilEditComponent } from './utensil/utensil-edit/utensil-edit.component';
import { SuppliesComponent } from './supplies/supplies.component';
import { SuppliesEditComponent } from './supplies/supplies-edit/supplies-edit.component';
import { ProcedureExecutionComponent } from './procedureexecution/procedureexecution.component';
import { ProcedureexecutionEditComponent } from './procedureexecution/procedureexecution-edit/procedureexecution-edit.component';
import { ProcedureExecutionByVariableByProcedureComponent } from './procedure-execution-by-variable-by-procedure/procedure-execution-by-variable-by-procedure.component';
import { ProcedureExecutionByVariableByProcedureEditComponent } from './procedure-execution-by-variable-by-procedure/procedure-execution-by-variable-by-procedure-edit/procedure-execution-by-variable-by-procedure-edit.component';
import { ProcedureExecutionByUtensilByProcedureComponent } from './procedure-execution-by-utensil-by-procedure/procedure-execution-by-utensil-by-procedure.component';
import { ProcedureExecutionByUtensilByProcedureEditComponent } from './procedure-execution-by-utensil-by-procedure/procedure-execution-by-utensil-by-procedure-edit/procedure-execution-by-utensil-by-procedure-edit.component';
import { ProcedureExecutionBySuppliesByProcedureEditComponent } from './procedure-execution-by-supplies-by-procedure/procedure-execution-by-supplies-by-procedure-edit/procedure-execution-by-supplies-by-procedure-edit.component';
import { ProcedureExecutionBySuppliesByProcedureComponent } from './procedure-execution-by-supplies-by-procedure/procedure-execution-by-supplies-by-procedure.component';

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
  },

  {
    path: 'procedure',
    component: ProcedureComponent,
    children: [
      {
        path: 'new',
        component: ProcedureEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProcedureEditComponent,
      },
    ],
  },
  
  {
    path: 'variable',
    component: VariableComponent,
    children: [
      {
        path: 'new',
        component: VariableEditComponent,
      },
      {
        path: 'edit/:id',
        component: VariableEditComponent,
      },
    ],
  },

  {
    path: 'utensil',
    component: UtensilComponent,
    children: [
      {
        path: 'new',
        component: UtensilEditComponent,
      },
      {
        path: 'edit/:id',
        component: UtensilEditComponent,
      },
    ],
  },

  {
    path: 'supplies',
    component: SuppliesComponent,
    children: [
      {
        path: 'new',
        component: SuppliesEditComponent,
      },
      {
        path: 'edit/:id',
        component: SuppliesEditComponent,
      },
    ],
  },
  {
    path: 'procedureexecution',
    component: ProcedureExecutionComponent,
    children: [
      {
        path: 'new',
        component: ProcedureexecutionEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProcedureexecutionEditComponent,
      },
    ],
  },

  {
    path: 'procedureexecutionbyvariable',
    component: ProcedureExecutionByVariableByProcedureComponent,
    children: [
      {
        path: 'new',
        component: ProcedureExecutionByVariableByProcedureEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProcedureExecutionByVariableByProcedureEditComponent,
      },
    ],
  },
  
  {
    path: 'procedureexecutionbyutensil',
    component: ProcedureExecutionByUtensilByProcedureComponent,
    children: [
      {
        path: 'new',
        component: ProcedureExecutionByUtensilByProcedureEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProcedureExecutionByUtensilByProcedureEditComponent,
      },
    ],
  },
  
  {
    path: 'procedureexecutionbysupplies',
    component: ProcedureExecutionBySuppliesByProcedureComponent,
    children: [
      {
        path: 'new',
        component: ProcedureExecutionBySuppliesByProcedureEditComponent,
      },
      {
        path: 'edit/:id',
        component: ProcedureExecutionBySuppliesByProcedureEditComponent,
      },
    ],
  },

];