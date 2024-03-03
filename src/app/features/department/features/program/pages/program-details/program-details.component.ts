import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgramDetailsTransport } from '../../../../../../shared/models/program';
import { Subject, takeUntil } from 'rxjs';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnInit, OnDestroy {
  programId: number = -1;
  program: ProgramDetailsTransport = {} as ProgramDetailsTransport;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private programService: ProgramService,
    private routeParametersService: RouteParametersService,
  ) {}

  ngOnInit(): void {
    this.routeParametersService.currentRoute$.subscribe(() => {
      this.programId = this.routeParametersService.programId;
      this.getProgram(this.programId);
    });
  }

  getProgram(programId: number) {
    this.programService
      .getProgramDetails(programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (programDetails: ProgramDetailsTransport) => {
          if (programDetails) {
            this.program = programDetails;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
