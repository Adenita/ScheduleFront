import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { StudentGroupTransport, StudentGroupListTransport } from '../../../shared/models/student-group';

@Injectable({
    providedIn: 'root',
})
export class StudentGroupsService extends DataService<StudentGroupTransport, StudentGroupListTransport> {
    constructor(httpClient: HttpClient) {
        super(httpClient);
        this.apiUrl = 'student_groups';
    }
}
