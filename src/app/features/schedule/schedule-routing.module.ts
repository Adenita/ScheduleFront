import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';
import { ProgramScheduleManagementComponent } from './pages/program-schedule-management/program-schedule-management.component';
import { ProfessorScheduleManagementComponent } from './pages/professor-schedule-management/professor-schedule-management.component';
// import { ScheduleGeneratorComponent } from './pages/schedule-generator/schedule-generator.component';

const routes: Routes = [
  { path: '', component: ScheduleManagementComponent },
  { path: ':scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
  { path: ':scid/programs/:pid', component: ProgramScheduleManagementComponent },
  { path: ':scid/professors/:ppid', component: ProfessorScheduleManagementComponent },
  // { path: 'generate', component: ScheduleGeneratorComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
