import { Component, OnInit } from '@angular/core';
import { ProfessorTransport, Role } from '../../shared/models/professor';
import { ProfessorService } from '../../core/http/professor.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../core/services/route-parameters.service';

@Component({
  selector: 'app-professors-management',
  templateUrl: './professor-management.component.html',
  styleUrls: ['./professor-management.component.css'],
})
export class ProfessorManagementComponent implements OnInit {
  departmentId: number = -1;
  programId: number = -1;
  professors$: BehaviorSubject<ProfessorTransport[]>;
  professorRoles: Role[] = Object.values(Role);
  route: string = '';
  professorForm: FormGroup;
  showForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
  ) {
    this.professorForm = this.buildFormGroup(formBuilder);
    this.professors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.route = this.routeParametersService.setRoute('professors');
      this.getProfessors();
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      role: new FormControl(Role.PROFESSOR),
    });
  }

  getProfessors(): void {
    this.professorService.getAll().subscribe({
      next: (professorTransport) => this.professors$.next(professorTransport.professors),
      error: (err) => console.error('Error fetching professors', err),
    });
  }

  postProfessor() {
    if (this.professorForm.valid) {
      const professor = this.professorForm.value;
      this.professorService.post(professor).subscribe({
        next: (postedProfessorTransport: ProfessorTransport) => {
          this.professors$.next([...this.professors$.getValue(), postedProfessorTransport]);
          this.closeForm();
        },
        error: (err) => console.error('Error posting professor:', err),
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
