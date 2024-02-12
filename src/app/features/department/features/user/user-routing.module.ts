import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { AuthGuard } from '../../../../auth/auth.guard';
import { Role } from '../../../../shared/models/user';

const routes: Routes = [
  {
    path: 'departments/:id/users',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'profile',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
