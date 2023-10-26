import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramManagementComponent } from './pages/program-management/program-management.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';

const routes: Routes = [
  { path: 'departments/:id/programs', component: ProgramManagementComponent },
  { path: 'departments/:id/programs/:pid', component: ProgramDetailsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramRoutingModule {}
