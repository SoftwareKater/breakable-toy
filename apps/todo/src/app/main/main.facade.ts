import { Injectable } from '@angular/core';

const MOCK_USER = {
    username: 'John Doe',
    alias: 'JD',
}

@Injectable()
export class MainFacade {
    public getUser(): any {
        return null;
        return MOCK_USER;
    }
}