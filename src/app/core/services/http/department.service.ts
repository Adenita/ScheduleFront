import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import {
    DepartmentDetailTransport,
    DepartmentListTransport,
    DepartmentScheduleDetailTransport,
    DepartmentTransport,
} from '../../../shared/models/department';
import { Observable } from 'rxjs';
import { ProgramListTransport, ProgramTransport } from '../../../shared/models/program';
import { ProfessorListTransport, ProfessorTransport } from '../../../shared/models/professor';
import { SubjectListTransport } from '../../../shared/models/subject';
import { ClassroomTransport } from '../../../shared/models/classroom';
import { UserListTransport } from '../../../shared/models/user';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService extends DataService<DepartmentTransport, DepartmentListTransport> {
    constructor(private httpClient: HttpClient) {
        super(httpClient);
        this.apiUrl = 'departments';
    }

    getProgramsPerDepartment(departmentId: number): Observable<ProgramListTransport> {
        return this.httpClient.get<ProgramListTransport>(`${this.url}/${this.apiUrl}/${departmentId}/programs`);
    }

    getProfessorsPerDepartment(departmentId: number): Observable<ProfessorListTransport> {
        return this.httpClient.get<ProfessorListTransport>(`${this.url}/${this.apiUrl}/${departmentId}/professors`);
    }

    getSubjectsPerDepartment(departmentId: number): Observable<SubjectListTransport> {
        return this.httpClient.get<SubjectListTransport>(`${this.url}/${this.apiUrl}/${departmentId}/subjects`);
    }

    postProgramToDepartment(departmentId: number, programTransport: ProgramTransport): Observable<ProgramTransport> {
        return this.httpClient.post<ProgramTransport>(`${this.url}/${this.apiUrl}/${departmentId}/programs`, programTransport);
    }

    postProfessorToDepartment(departmentId: number, professorTransport: ProfessorTransport): Observable<ProfessorTransport> {
        return this.httpClient.post<ProfessorTransport>(
            `${this.url}/${this.apiUrl}/${departmentId}/professors`,
            professorTransport,
        );
    }

    getDepartmentScheduleDetails(departmentId: number): Observable<DepartmentScheduleDetailTransport> {
        return this.httpClient.get<DepartmentScheduleDetailTransport>(
            `${this.url}/${this.apiUrl}/${departmentId}/schedule-details`,
        );
    }

    getDepartmentDetails(departmentId: number): Observable<DepartmentDetailTransport> {
        return this.httpClient.get<DepartmentDetailTransport>(`${this.url}/${this.apiUrl}/${departmentId}/details`);
    }

    getDepartmentClassrooms(departmentId: number): Observable<ClassroomTransport> {
        return this.httpClient.get<ClassroomTransport>(`${this.url}/${this.apiUrl}/${departmentId}/classrooms`);
    }

    getDepartmentUsers(departmentId: number): Observable<UserListTransport> {
        return this.httpClient.get<UserListTransport>(`${this.url}/${this.apiUrl}/${departmentId}/users`);
    }
}
