import { Routes } from '@angular/router';
import { CompanyTypeEditComponent } from './companytype/companytype-edit/companytype-edit.component';
import { CompanyTypeComponent } from './companytype/companytype.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClienteEditComponent } from './cliente/cliente-edit/cliente-edit.component';



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
  }

];
