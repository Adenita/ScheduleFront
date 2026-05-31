import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { LoginPageComponent } from './components/login-page/login-page.component';

@NgModule({
  declarations: [LoginPageComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginPageComponent],
})
export class AuthModule {}
