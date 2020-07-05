import { Credentials } from './credentials.interface';

export interface CreateAuthSubject extends Credentials {    
  alias?: string;
  email?: string;
  userId?: string;
}