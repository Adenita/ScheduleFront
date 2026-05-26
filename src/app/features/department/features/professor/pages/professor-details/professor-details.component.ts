import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorDetailsTransport } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { Role } from '../../../../../../shared/models/user';
import { PermissionService } from '../../../../../../auth/services/permission.service';

@Component({
  selector: 'app-professor-details',
  standalone: false,
  templateUrl: './professor-details.component.html',
  styleUrls: ['./professor-details.component.scss'],
})
export class ProfessorDetailsComponent implements OnInit, OnDestroy {
  professorId: number = -1;
  professor: ProfessorDetailsTransport = {} as ProfessorDetailsTransport;
  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();
  hasPermission: boolean = false;

  constructor(
    private routeParametersService: RouteParametersService,
    private professorService: ProfessorService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.routeParametersService.currentRoute$.subscribe(() => {
      this.professorId = this.routeParametersService.professorId;
      this.getProfessor(this.professorId);
    });
    this.hasPermission = this.permissionService.hasAnyRole([Role.ADMIN, Role.PROFESSOR]);
  }

  getProfessor(professorId: number) {
    this.professorService
      .getProfessorDetails(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorDetails: ProfessorDetailsTransport) => {
          if (professorDetails) {
            this.professor = professorDetails;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
