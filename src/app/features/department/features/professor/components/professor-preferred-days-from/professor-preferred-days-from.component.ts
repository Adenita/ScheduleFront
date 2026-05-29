import { Component, OnDestroy, OnInit } from '@angular/core';
import { DAY } from '../../../../../../shared/models/timeslots';
import { ProfessorDetailsTransport, ProfessorPreferredDay } from '../../../../../../shared/models/professor';
import { ProfessorPreferredDaysFromModalComponent } from '../professor-preferred-days-from-modal/professor-preferred-days-from-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PreferredDayModalData, PreferredDayModalManagementService } from '../../services/preferred-day-modal-management.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professor-preferred-days-from',
  standalone: false,
  templateUrl: './professor-preferred-days-from.component.html',
  styleUrls: ['./professor-preferred-days-from.component.css'],
})
export class ProfessorPreferredDaysFromComponent implements OnInit, OnDestroy {
  days: DAY[] = Object.values(DAY);
  form: FormGroup;
  preferredDayModalData: PreferredDayModalData;
  selectedId: number = -1;
  isEditeMode: boolean = false;
  selectedDay!: DAY;
  destroyed$: Subject<void> = new Subject();

  professorId!: number;

  professorPreferredDays$!: BehaviorSubject<ProfessorPreferredDay[]>;

  constructor(
    private preferredDayModalManagementService: PreferredDayModalManagementService,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.preferredDayModalData = {} as PreferredDayModalData;
    this.form = this.formBuilder.group({
      day: [{ disabled: false }, Validators.required],
      preferredStartHour: new FormControl(0, Validators.required),
      preferredStartMinute: new FormControl(0, Validators.required),
      preferredEndHour: new FormControl(0, Validators.required),
      preferredEndMinute: new FormControl(0, Validators.required),
    });
    this.professorPreferredDays$ = new BehaviorSubject<ProfessorPreferredDay[]>([]);
  }

  ngOnInit() {
    this.preferredDayModalData = this.preferredDayModalManagementService.bindPreferredDayData(
      this.selectedId,
      this.form,
      this.isEditeMode,
      this.professorPreferredDays$,
      this.days,
      this.selectedDay,
    );
    this.professorPreferredDays$.next(this.sortPreferredDays(this.professorPreferredDays$.getValue()));
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.professorId = this.getProfessorIdFromRoute();
      if (this.professorId !== -1) {
        this.getProfessor(this.professorId);
      }
    });
  }

  getProfessor(professorId: number) {
    this.professorService
      .getProfessorDetails(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorDetails: ProfessorDetailsTransport) => {
          if (professorDetails) {
            this.professorPreferredDays$.next(professorDetails.preferredDays);
          }
        },
      });
  }

  addPreferredDayToProfessor() {
    if (this.form.valid) {
      this.professorService
        .addPreferredDayToProfessor(this.professorId, this.form.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (preferredDay: ProfessorPreferredDay) => {
            const updatedList: ProfessorPreferredDay[] = [...this.professorPreferredDays$.getValue(), preferredDay];
            this.professorPreferredDays$.next(this.sortPreferredDays(updatedList));
          },
        });
    }
  }

  deleteProfessorPreferredDay(professorId: number, day: string) {
    this.professorService
      .deleteProfessorPreferredDay(professorId, day)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentPreferredDays: ProfessorPreferredDay[] = this.professorPreferredDays$.getValue();
          const updatedPreferredDays: ProfessorPreferredDay[] = currentPreferredDays.filter((pd) => pd.day !== day);
          this.professorPreferredDays$.next(updatedPreferredDays);
        },
        error: (err) => console.error('Error deleting professor:', err),
      });
  }

  sortPreferredDays(preferredDays: ProfessorPreferredDay[]): ProfessorPreferredDay[] {
    return preferredDays.sort((a, b) => this.days.indexOf(a.day) - this.days.indexOf(b.day));
  }

  private getProfessorIdFromRoute(): number {
    const route = this.activatedRoute.pathFromRoot.find((routePart) => routePart.snapshot.paramMap.has('ppid'));
    return Number(route?.snapshot.paramMap.get('ppid')) || -1;
  }

  updateProfessorPreferredDay(professorId: number) {
    if (this.form.valid) {
      this.professorService
        .updateProfessorPreferredDay(professorId, this.form.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedPreferredDay: ProfessorPreferredDay) => {
            const currentPreferredDays: ProfessorPreferredDay[] = this.professorPreferredDays$.getValue();
            const updatedPreferredDays: ProfessorPreferredDay[] = currentPreferredDays.map((pd) => {
              if (pd.day === updatedPreferredDay.day) {
                return updatedPreferredDay;
              }
              return pd;
            });
            this.professorPreferredDays$.next(updatedPreferredDays);
          },
          error: (err) => console.error('Error updating professor:', err),
        });
    }
  }

  openModal() {
    this.preferredDayModalManagementService.post = this.addPreferredDayToProfessor.bind(this);
    this.form.get('day')?.enable();
    this.preferredDayModalManagementService.openFormModal(ProfessorPreferredDaysFromModalComponent, this.preferredDayModalData);
  }

  openEditModal(day: DAY) {
    this.preferredDayModalManagementService.update = this.updateProfessorPreferredDay.bind(this);
    this.preferredDayModalManagementService.openProfessorPreferenceFormModalInEditMode(
      ProfessorPreferredDaysFromModalComponent,
      this.professorId,
      day,
      this.preferredDayModalData,
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
