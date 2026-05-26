import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProfessorPreferredDay } from '../../../../../shared/models/professor';
import { DAY } from '../../../../../shared/models/timeslots';
import { ProfessorPreferredDaysFromModalComponent } from '../components/professor-preferred-days-from-modal/professor-preferred-days-from-modal.component';

export interface PreferredDayModalData extends GeneralModalData {
  days: DAY[];
  selectedDay: DAY;
}
@Injectable({
  providedIn: 'root',
})
export class PreferredDayModalManagementService extends ModalManagementService<
  ProfessorPreferredDaysFromModalComponent,
  PreferredDayModalData
> {
  openProfessorPreferenceFormModalInEditMode(
    modalComponent: typeof ProfessorPreferredDaysFromModalComponent,
    professorId: number,
    day: DAY,
    modalData: PreferredDayModalData,
  ) {
    modalData.isEditMode = true;
    modalData.selectedDay = day;
    modalData.selectedId = professorId;
    const currentData = modalData.data$.getValue();
    const selectedData = currentData.find((s: ProfessorPreferredDay) => s.day === day);
    if (selectedData) {
      modalData.form.patchValue(selectedData);
    }
    modalData.form.get('day')?.disable();
    this.openFormModal(modalComponent, modalData);
  }

  bindPreferredDayData(
    selectedId: number,
    form: FormGroup,
    isEditMode: boolean,
    preferredDays$: BehaviorSubject<ProfessorPreferredDay[]>,
    days: DAY[],
    selectedDay: DAY,
  ): PreferredDayModalData {
    return {
      selectedId,
      form,
      isEditMode,
      data$: preferredDays$,
      days,
      selectedDay,
    };
  }
}
