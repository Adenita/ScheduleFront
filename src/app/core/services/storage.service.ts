import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../../shared/models/user';
import { BehaviorSubject } from 'rxjs';

enum TokenType {
  ACCESS = 'AccessToken',
  REFRESH = 'RefreshToken',
}

type UserAuthTransport = {
  username: string;
  roles: Role[];
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storedUser$: BehaviorSubject<UserAuthTransport | null>;

  constructor() {
    this.storedUser$ = new BehaviorSubject<UserAuthTransport | null>(this.getUser());
  }

  setToken(name: string, token: string) {
    localStorage.setItem(name, token);
  }

  setAccessToken(token: string) {
    this.setToken(TokenType.ACCESS, token);
  }

  setUser(user: UserAuthTransport) {
    localStorage.setItem('user', JSON.stringify({ username: user.username, roles: user.roles }));
  }

  getAccessToken() {
    return localStorage.getItem(TokenType.ACCESS);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '""');
  }
  removeAccessToken() {
    localStorage.removeItem(TokenType.ACCESS);
  }

  removeUser() {
    localStorage.removeItem('user');
  }

  storeUserAndTokenToStorage(user: UserAuthTransport, token: string) {
    this.setUser(user);
    this.setAccessToken(token);
  }

  removeUserAndTokenFromStorage() {
    this.removeUser();
    this.removeAccessToken();
  }

  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.exp === undefined) {
      return false;
    }
    const expirationDate: Date = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    return expirationDate.valueOf() <= new Date().valueOf();
  }
}
