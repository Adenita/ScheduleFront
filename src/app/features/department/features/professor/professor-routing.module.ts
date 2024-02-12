import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { AuthGuard } from '../../../../auth/auth.guard';
import { Role } from '../../../../shared/models/user';

const routes: Routes = [
  {
    path: 'departments/:id/professors',
    component: ProfessorManagementComponent,
  },
  {
    path: 'departments/:id/professors/:ppid',
    component: ProfessorDetailsComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR] },
  },
  {
    path: 'departments/:id/programs/:pid/professors',
    component: ProfessorManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/professors/:ppid',
    component: ProfessorDetailsComponent,
  },
  {
    path: 'departments/:id/subjects/:sid/professors',
    component: ProfessorManagementComponent,
  },
  {
    path: 'departments/:id/subjects/:sid/professors/:ppid',
    component: ProfessorDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects/:sid/professors',
    component: ProfessorManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid//subjects/:sid/professors/:ppid',
    component: ProfessorDetailsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorRoutingModule {}
