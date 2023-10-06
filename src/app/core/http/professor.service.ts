import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataService} from "../services/data.service";
import {Professor, ProfessorTransport} from "../../shared/models/professor";

@Injectable({
  providedIn: 'root',
})
export class ProfessorService extends DataService<Professor, ProfessorTransport>{
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = "professors";
  }
}
