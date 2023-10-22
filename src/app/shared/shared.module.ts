import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [SubjectListComponent, ProfessorListComponent],
  imports: [CommonModule, RouterLink],
  exports: [SubjectListComponent, ProfessorListComponent],
})
export class SharedModule {}
