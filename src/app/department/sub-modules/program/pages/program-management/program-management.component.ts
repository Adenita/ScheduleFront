import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../core/http/program.service';
import { DepartmentService } from '../../../../../core/http/department.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../core/services/route-parameters.service';
import { BehaviorSubject } from 'rxjs';
import { ProgramTransport, ProgramListTransport } from '../../../../../shared/models/program';

@Component({
  selector: 'app-program-management',
  templateUrl: './program-management.component.html',
  styleUrls: ['./program-management.component.css'],
})
export class ProgramManagementComponent implements OnInit {
  departmentId: number = -1;
  programs$: BehaviorSubject<ProgramTransport[]>;
  route: string = '';
  programForm: FormGroup;
  showForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
  ) {
    this.programForm = this.buildFormGroup(formBuilder);
    this.programs$ = new BehaviorSubject<ProgramTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.route = this.routeParametersService.setRoute('programs');
      this.loadDepartmentPrograms(this.departmentId);
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      departmentId: this.departmentId,
    });
  }

  loadDepartmentPrograms(departmentId: number): void {
    this.departmentService.getProgramsPerDepartment(departmentId).subscribe({
      next: (programsTransport: ProgramListTransport) => {
        this.programs$.next(programsTransport.programTransports);
      },
      error: (err) => console.error('Error loading department programs', err),
    });
  }

  postProgram() {
    if (this.programForm.valid) {
      const program = this.programForm.value;
      this.programService.post(program).subscribe({
        next: (postedProgramTransport: ProgramTransport) => {
          this.programs$.next([...this.programs$.getValue(), postedProgramTransport]);
          this.closeForm();
        },
        error: (err) => console.error('Error posting program:', err),
      });
    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
