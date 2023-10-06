import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DepartmentService} from "../../core/http/department.service";
import {BehaviorSubject} from "rxjs";
import { DepartmentTransport} from "../../shared/models/department";
import {Professor} from "../../shared/models/professor";
import {Classroom} from "../../shared/models/classroom";
import {Program, ProgramDetails} from "../../shared/models/program";

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit {
  departmentId: number = -1;
  department: DepartmentTransport = {} as DepartmentTransport;
  previewPrograms: BehaviorSubject<Program[] | ProgramDetails[]>;
  previewProfessors: BehaviorSubject<Professor[]>;

  constructor(private route: ActivatedRoute, private departmentService: DepartmentService) {
    this.previewPrograms = new BehaviorSubject<Program[] | ProgramDetails[]>([]);
    this.previewProfessors = new BehaviorSubject<Professor[]>([]);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = +params['id'];
      this.getDepartment(this.departmentId);
    });
  }

   getDepartment(departmentId: number) {
    this.departmentService.getDepartmentDetails(departmentId).subscribe({next: (department) => {
       this.department = department;
       this.previewPrograms.next(department.programTransports.slice(0, 3));
       this.previewProfessors.next(department.professorTransports.slice(0,3));
      }})
  }

}
