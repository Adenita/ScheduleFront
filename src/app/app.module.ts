import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './schedule/pages/schedule-management/schedule-management.component';
import { HomeComponent } from './pages/home/home.component';
import { DepartmentModule } from './department/department.module';
import { ScheduleModule } from './schedule/schedule.module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schedules', component: ScheduleManagementComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes), DepartmentModule, ScheduleModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
