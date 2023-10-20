import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../core/http/department.service';
import { BehaviorSubject } from 'rxjs';
import { DepartmentTransport } from '../../shared/models/department';
import { ProfessorTransport } from '../../shared/models/professor';
import { Classroom } from '../../shared/models/classroom';
import { ProgramTransport, ProgramDetailsTransport } from '../../shared/models/program';
import { RouteParametersService } from '../../core/services/route-parameters.service';
import { SubjectTransport } from '../../shared/models/subject';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css'],
})
export class DepartmentDetailsComponent implements OnInit {
  departmentId: number = -1;
  numberToPreview: number = 3;
  department: DepartmentTransport = {} as DepartmentTransport;
  previewPrograms: BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>;
  previewProfessors: BehaviorSubject<ProfessorTransport[]>;
  previewClassrooms: BehaviorSubject<Classroom[]>;
  previewSubjects: BehaviorSubject<SubjectTransport[]>;
  currentRoute: string = '';

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
  ) {
    this.previewPrograms = new BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>([]);
    this.previewProfessors = new BehaviorSubject<ProfessorTransport[]>([]);
    this.previewClassrooms = new BehaviorSubject<Classroom[]>([]);
    this.previewSubjects = new BehaviorSubject<SubjectTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService.getRouteParams(this.route).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('');
      this.getDepartment(this.departmentId);
    });
  }

  getDepartment(departmentId: number) {
    this.departmentService.getDepartmentDetails(departmentId).subscribe({
      next: (department) => {
        this.department = department;
        this.previewPrograms.next(department.programTransports.slice(0, this.numberToPreview));
        this.previewProfessors.next(department.professorTransports.slice(0, this.numberToPreview));
        this.previewClassrooms.next(department.classrooms.slice(0, this.numberToPreview));
        this.previewSubjects.next(department.subjectTransports.slice(0, this.numberToPreview));
      },
    });
  }
}
