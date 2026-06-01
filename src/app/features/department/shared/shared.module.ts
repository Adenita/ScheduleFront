import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';

@NgModule({
    declarations: [SubjectListComponent, ProfessorListComponent],
    imports: [CommonModule, RouterLink],
    exports: [SubjectListComponent, ProfessorListComponent],
})
export class SharedModule {}
