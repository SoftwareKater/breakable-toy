import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@breakable-toy/shared/data-access/user-api-client';

@Injectable()
export class SessionService {
  _user: BehaviorSubject<User> = new BehaviorSubject(null);
  user$: Observable<User> = this._user.asObservable();
  set user(value: User) {
    this._user.next(value);
  }

  _accessToken: BehaviorSubject<string> = new BehaviorSubject('');
  accessToken$: Observable<string> = this._accessToken.asObservable();
  set accessToken(value: any) {
    this._accessToken.next(value);
    sessionStorage.setItem('access_token', value);
  }
}
