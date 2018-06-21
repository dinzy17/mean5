import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
  user_id: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string
  private user_id: string

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string, user_id: string): void {
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', user_id)
    this.token = token
    this.user_id = user_id
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }
    return this.token;
  }

  private getUser(): string {
    if (!this.user_id) {
      this.user_id = localStorage.getItem('user_id')
    }
    return this.user_id;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken()
    const user_id = this.getUser()
    let payload;
    if (token && user_id) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: string, user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token, data.user_id)
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'users/register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'users/login', user);
  }

  public profile(): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.request('get', 'users/profile/' + user_id )
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user_id')
    this.router.navigateByUrl('/');
  }

  public userList(): Observable<any> {
    return this.request('get', 'users/list/')
  }
}
