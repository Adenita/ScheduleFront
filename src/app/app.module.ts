import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './components/schedule-management/schedule-management.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleProgramComponent } from './components/schedule-program/schedule-program.component';
import { DepartmentModule } from './department/department.module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schedules', component: ScheduleComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleManagementComponent,
    ScheduleComponent,
    ScheduleGenerationModalComponent,
    HomeComponent,
    ScheduleProgramComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes), DepartmentModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
