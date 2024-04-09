import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';
import { ProgramScheduleManagementComponent } from './pages/program-schedule-management/program-schedule-management.component';
import { ProfessorScheduleManagementComponent } from './pages/professor-schedule-management/professor-schedule-management.component';
import { ScheduleGeneratorComponent } from './components/schedule-generator/schedule-generator.component';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../shared/models/user';
import { ScheduleGeneratorManagementComponent } from './pages/schedule-generator-management/schedule-generator-management.component';

const routes: Routes = [
  { path: '', component: ScheduleManagementComponent },
  { path: ':scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
  { path: ':scid/programs/:pid', component: ProgramScheduleManagementComponent },
  { path: ':scid/professors/:ppid', component: ProfessorScheduleManagementComponent },
  {
    path: 'generate',
    component: ScheduleGeneratorManagementComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
    children: [{ path: ':ddid', component: ScheduleGeneratorComponent }],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
