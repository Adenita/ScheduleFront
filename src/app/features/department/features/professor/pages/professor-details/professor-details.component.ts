import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfessorDetailsTransport } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { Role } from '../../../../../../shared/models/user';
import { PermissionService } from '../../../../../../auth/services/permission.service';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
    private professorService: ProfessorService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.professorId = this.getProfessorIdFromRoute();
      if (this.professorId !== -1) {
        this.getProfessor(this.professorId);
      }
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

  private getProfessorIdFromRoute(): number {
    const route = this.activatedRoute.pathFromRoot.find((routePart) => routePart.snapshot.paramMap.has('ppid'));
    return Number(route?.snapshot.paramMap.get('ppid')) || -1;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
