import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SubjectTransport } from '../../../../../../shared/models/subject';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorDetailsTransport, ProfessorPreferredDay } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';

@Component({
  selector: 'app-professor-details',
  templateUrl: './professor-details.component.html',
  styleUrls: ['./professor-details.component.scss'],
})
export class ProfessorDetailsComponent implements OnInit, OnDestroy {
  professorId: number = -1;
  professor: ProfessorDetailsTransport = {} as ProfessorDetailsTransport;
  preferredDays$: BehaviorSubject<ProfessorPreferredDay[]>;
  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeParametersService: RouteParametersService,
    private professorService: ProfessorService,
  ) {
    this.preferredDays$ = new BehaviorSubject<ProfessorPreferredDay[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getNavigationEndParams(this.router, this.activatedRoute, this.destroyed$).then(() => {
      this.currentRoute = this.routeParametersService.currentRoute;
      this.professorId = this.routeParametersService.professorId;
      this.currentRoute = this.routeParametersService.currentRoute;
      this.getProfessor(this.professorId);
    });
  }

  getProfessor(professorId: number) {
    this.professorService
      .getProfessorDetails(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorDetails: ProfessorDetailsTransport) => {
          if (professorDetails) {
            this.professor = professorDetails;
            this.preferredDays$.next(professorDetails.preferredDays);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
