import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';

const routes: Routes = [
  { path: 'departments', component: DepartmentsListComponent },
  { path: 'departments/:id', component: DepartmentDetailsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}
