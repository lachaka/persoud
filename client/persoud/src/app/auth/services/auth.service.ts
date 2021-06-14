import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const body = {
      email,
      password
    };

    return this.http.post(`${this.baseUrl}/login`, body, { withCredentials: true });
  }

  register(email: string, password: string) {
    const body = {
      email,
      password
    };

    return this.http.post(`${this.baseUrl}/register`, body, { withCredentials: true }); 
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}
