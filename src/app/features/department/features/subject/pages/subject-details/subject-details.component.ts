import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SubjectDetailsTransport } from '../../../../../../shared/models/subject';
import { StudentGroupTransport } from '../../../../../../shared/models/student-group';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorTransport } from '../../../../../../shared/models/professor';
import { SubjectService } from '../../../../../../core/services/http/subjects.service';

@Component({
  selector: 'app-subject-details',
  standalone: false,
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.css'],
})
export class SubjectDetailsComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  subjectId: number = -1;
  numberToPreview: number = 3;
  subject: SubjectDetailsTransport = {} as SubjectDetailsTransport;
  previewStudentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  previewProfessors$: BehaviorSubject<ProfessorTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();
  currentRoute: string = '';

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private subjectService: SubjectService,
  ) {
    this.previewStudentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
    this.previewProfessors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getRouteParams(this.route).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.subjectId = this.routeParametersService.subjectId;
      this.currentRoute = this.routeParametersService.setRoute('');
      this.getSubject(this.subjectId);
    });
  }

  getSubject(subjectId: number) {
    this.subjectService
      .getSubjectDetails(subjectId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectDetailsTransport: SubjectDetailsTransport) => {
          this.subject = subjectDetailsTransport;
          this.previewStudentGroups$.next(subjectDetailsTransport.studentGroups.slice(0, this.numberToPreview));
          this.previewProfessors$.next(subjectDetailsTransport.professors.slice(0, this.numberToPreview));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
