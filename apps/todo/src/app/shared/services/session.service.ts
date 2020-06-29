import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SessionService {
  _user: BehaviorSubject<any> = new BehaviorSubject(null);
  user$: Observable<any> = this._user.asObservable();
  set user(value: any) {
    this._user.next(value);
  }

  _accessToken: BehaviorSubject<string> = new BehaviorSubject('');
  accessToken$: Observable<string> = this._accessToken.asObservable();
  set accessToken(value: any) {
    this._accessToken.next(value);
  }
}
