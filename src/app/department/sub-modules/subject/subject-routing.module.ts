import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectManagementComponent } from './pages/subject-management/subject-management.component';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';

const routes: Routes = [
  {
    path: 'departments/:id/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/professors/:ppid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/professors/:ppid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/student_groups/:ssid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/student_groups/:ssid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/professors/ppid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/professors/ppid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/student_groups/ssid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/student_groups/ssid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectRoutingModule {}
