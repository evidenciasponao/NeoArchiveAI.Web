import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  User
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://192.168.1.28:5263/api/auth';

  private readonly tokenKey = 'neoarchive_access_token';
  private readonly userKey = 'neoarchive_user';

  readonly currentUser = signal<User | null>(this.loadUser());

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          sessionStorage.setItem(
            this.tokenKey,
            response.accessToken
          );

          sessionStorage.setItem(
            this.userKey,
            JSON.stringify(response.user)
          );

          this.currentUser.set(response.user);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);

    this.currentUser.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser(): User | null {
    const user = sessionStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
  }
}
