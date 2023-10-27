import { Injectable } from '@angular/core';
import { SubjectFormModalComponent } from '../components/subject-form-modal/subject-form-modal.component';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { LabRequirement, SubjectDetailsTransport, SubjectTransport } from '../../../../../shared/models/subject';
import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';

export interface SubjectModalData extends GeneralModalData {
  showForm: boolean;
  isEditMode: boolean;
  labRequirements: LabRequirement[];
  departmentSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectModalManagementService extends ModalManagementService<SubjectFormModalComponent, SubjectModalData> {
  bindSubjectModalData(
    selectedSubjectId: number,
    showForm: boolean,
    subjectForm: FormGroup,
    isEditMode: boolean,
    labRequirements: LabRequirement[],
    subjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>,
    departmentSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>,
    route: string,
  ): SubjectModalData {
    return {
      selectedId: selectedSubjectId,
      showForm,
      form: subjectForm,
      isEditMode,
      labRequirements,
      data$: subjects$,
      departmentSubjects$,
      route,
    };
  }
}
