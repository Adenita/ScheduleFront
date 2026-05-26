import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserTransport, UserListTransport } from '../../../shared/models/user';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DataService<UserTransport, UserListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'users';
  }

  getUserByUsername(username: string): Observable<UserTransport> {
    return this.httpClient.get<UserTransport>(`${this.url}/${this.apiUrl}/${username}$`);
  }
}
