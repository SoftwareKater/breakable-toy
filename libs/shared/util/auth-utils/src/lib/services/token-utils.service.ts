import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types';

@Injectable()
export class TokenUtilsService {
  constructor(private readonly jwtService: JwtService) {}

  public userIdsMatch(accessToken: string, userIdToCompare: string): boolean {
    const userId = this.getUserIdFromToken(accessToken);
    if (userId === userIdToCompare) {
      return true;
    }
    return false;
  }

  public extractTokenFromHeader(headers: any): string {
    return headers?.authorization?.split(' ')[1];
  }

  public extractUserIdFromHeader(headers: any): string {
    const token = this.extractTokenFromHeader(headers);
    const userId = this.getUserIdFromToken(token);
    return userId;
  }

  private getUserIdFromToken(accessToken: string): string {
    // how to type this? I know that it will be JwtPayload...
    const decodedToken: any = this.jwtService.decode(accessToken, {});
    const id = decodedToken.subject.userId;
    return id;
  }
}
