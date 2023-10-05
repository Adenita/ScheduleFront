import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataService} from "../services/data.service";
import {Program, ProgramDetails, ProgramsTransport} from "../../shared/models/program";
import {Observable} from "rxjs";
import {SubjectTransport} from "../../shared/models/subject";

@Injectable({
  providedIn: 'root',
})
export class ProgramService extends DataService<Program, ProgramsTransport> {
   private _departmentId: number | null = null;

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  set departmentId(departmentId) {
    this._departmentId = departmentId;
  }
  get departmentId() {
    return this._departmentId;
  }

  override get apiUrl(): string {
    if (this.departmentId !== null) {
      return `departments/${this.departmentId}/programs`;
    }
    return '';
  }

  getSubjectsPerProgram(departmentId:number, programId: number): Observable<SubjectTransport> {
    return this.httpClient.get<SubjectTransport>(`${this.url}/departments/${departmentId}/${this.apiUrl}/${programId}/subjects`);
  }

  getProgramDetails(programId: number): Observable<ProgramDetails> {
    return this.httpClient.get<ProgramDetails>(`${this.url}/programs/${programId}/details`);
  }
}
