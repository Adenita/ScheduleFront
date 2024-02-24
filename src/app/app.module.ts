import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleModule } from './features/schedule/schedule.module';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'departments', loadChildren: () => import('./features/department/department.module').then((m) => m.DepartmentModule) },
];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes), ScheduleModule, AuthModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
