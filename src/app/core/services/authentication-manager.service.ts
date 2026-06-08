import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './http/authentication.service';
import { FormGroup } from '@angular/forms';
import { TokenTransport } from '../../shared/models/authentication';
import { StorageService } from './storage.service';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationManagerService {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private storageService: StorageService,
    ) {}

    login(loginForm: FormGroup): Observable<boolean> {
        if (loginForm.valid) {
            const credentials = { ...loginForm.getRawValue() };

            return this.authenticationService.login(credentials).pipe(
                tap((tokenTransport: TokenTransport) => {
                    const loggedUser = { username: tokenTransport.username, roles: tokenTransport.roles };
                    this.storageService.storeUserAndTokenToStorage(loggedUser, tokenTransport.token);
                    this.storageService.storedUser$.next(loggedUser);
                    this.router.navigate(['/dashboard']);
                }),
                map(() => true),
                catchError((err) => {
                    console.error('Login failed', err);
                    this.storageService.removeUserAndTokenFromStorage();
                    this.storageService.storedUser$.next(null);
                    return of(false);
                }),
            );
        }

        return of(false);
    }

    logout() {
        this.router.navigate(['/']).then(() => {
            this.storageService.removeUserAndTokenFromStorage();
            this.storageService.storedUser$.next(null);
        });
    }

    isLoggedIn() {
        return !!this.storageService.getAccessToken();
    }
}
