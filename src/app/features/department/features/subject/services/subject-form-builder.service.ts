import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LabRequirement } from '../../../../../shared/models/subject';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubjectFormBuilderService {
  private readonly _subjectForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this._subjectForm = formBuilder.group({
      name: new FormControl('', Validators.required),
      etcs: new FormControl(Validators.min(4)),
      requiresLab: new FormControl(LabRequirement.NO),
      semester: new FormControl(Validators.min(1)),
    });
  }

  get subjectForm() {
    return this._subjectForm;
  }
}
