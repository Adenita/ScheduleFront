import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormModalComponent } from './components/login-form-modal/login-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthModule {}
