import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectManagementComponent } from './pages/subject-management/subject-management.component';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';
import { SubjectRoutingModule } from './subject-routing.module';

@NgModule({
  declarations: [SubjectListComponent, SubjectManagementComponent, SubjectDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, SubjectRoutingModule],
  exports: [SubjectListComponent],
})
export class SubjectModule {}
