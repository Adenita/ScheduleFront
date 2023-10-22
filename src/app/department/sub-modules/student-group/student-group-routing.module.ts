import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentGroupManagementComponent } from './pages/student-group-management/student-group-management.component';

const routes: Routes = [
  {
    path: 'departments/:id/student_groups',
    component: StudentGroupManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/student_groups',
    component: StudentGroupManagementComponent,
  },
  {
    path: 'departments/:id/subjects/:sid/student_groups',
    component: StudentGroupManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects/:sid/student_groups',
    component: StudentGroupManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/professors/:ppid/subjects/:sid/student_groups',
    component: StudentGroupManagementComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentGroupRoutingModule {}
