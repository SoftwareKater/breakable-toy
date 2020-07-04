import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthSubject } from '../resources/auth-subject.dto';
import { Credentials } from '../resources/credentials.dto';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
import { JwtPayload } from '../resources/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly subjectService: MongoAuthSubjectService
  ) {}

  public async validateCredentials(
    username: string,
    password: string
  ): Promise<AuthSubject> {
    Logger.verbose('Validating subject by username + password...');

    let subject: AuthSubject;
    subject = await this.subjectService.getByUsername(username);
    if (subject === null) {
      Logger.error(
        `Validation failed: No auth subject found with that name ${username}`
      );
      return null;
    }
    return new Promise((resolve, reject) => {
      this.compareEnteredPasswordWithStoredHash(
        password,
        subject.passwordHash
      ).then((match) => {
        if (match) {
          resolve(subject);
        } else {
          resolve(null);
        }
      });
    });
  }

  /** Returns a jwt access token. Does NOT validate the credentials. */
  public async login(credentials: Credentials): Promise<string> {
    // TODO: just take the username or an AuthSubject, but not the password...
    Logger.verbose(
      `Creating jwt for auth subject with name ${credentials.username}`
    );
    const subject: AuthSubject = await this.subjectService.getByUsernameOmitPasswordHash(
      credentials.username
    );
    if (subject === null) {
      Logger.error(
        `Token creation failed: No auth subject found with that name ${name}`
      );
      return null;
    }
    const payload: JwtPayload = { subject, sub: credentials.username };
    const signedToken = await this.jwtService.signAsync(payload);
    return signedToken;
  }

  /** Verifies a jwt access token */
  public async validateToken(jwt: string): Promise<any> {
    const verif: JwtPayload = await this.jwtService.verifyAsync(jwt);
    return verif;
  }

  /** Wrapper around bcrypt compare method */
  private async compareEnteredPasswordWithStoredHash(
    enteredPassword: string,
    storedHash: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(enteredPassword, storedHash, (err, same) => {
        if (err) {
          Logger.error(
            'Validation failed due to error in bcrypt compare method.'
          );
          // reject(err);
          resolve(false);
        }
        if (same === true) {
          Logger.verbose('Validation succeded: subject is authenticated.');
          resolve(true);
        } else {
          Logger.verbose(
            'Validation succeded: subject is NOT authenticated (username and password do not match).'
          );
          resolve(false);
        }
      });
    });
  }
}
