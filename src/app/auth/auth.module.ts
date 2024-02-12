import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormModalComponent } from './components/login-form-modal/login-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';

@NgModule({
  declarations: [LoginFormModalComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthModule {}
