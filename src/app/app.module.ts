import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { CustomRouterLinkActiveDirective } from './directives/custom-router-link-active.directive';
import { AboutusComponent } from './pages/aboutus/aboutus.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
  },
  {
    path: 'departments',
    loadChildren: () => import('./features/department/department.module').then((m) => m.DepartmentModule),
  },
  {
    path: 'schedules',
    loadChildren: () => import('./features/schedule/schedule.module').then((m) => m.ScheduleModule),
  },
  {
    path: 'me',
    loadChildren: () => import('./features/department/features/professor/professor.module').then((m) => m.ProfessorModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./features/department/features/user/user.module').then((m) => m.UserModule),
  },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, AboutusComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AuthModule,
    CustomRouterLinkActiveDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
