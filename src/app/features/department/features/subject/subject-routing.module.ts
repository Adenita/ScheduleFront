import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectManagementComponent } from './pages/subject-management/subject-management.component';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectManagementComponent,
    children: [
      {
        path: ':sid',
        component: SubjectDetailsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectRoutingModule {}
