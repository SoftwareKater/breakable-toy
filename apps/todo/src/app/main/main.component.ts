import { Component, OnInit } from '@angular/core';
import { MainFacade } from './main.facade';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';

@Component({
  selector: 'skbt-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private readonly mainFacade: MainFacade,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public openAuthOrAccountDialog() {
    const user = this.mainFacade.getUser();
    if (user) {
      // Show account settings and logout button
    } else {
        this.openAuthDialog();
    }
  }

  public openSettings() {}

  private openAuthDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '360px';
    dialogConfig.height = '512px';

    const authDialogRef = this.dialog.open(
      AuthDialogComponent,
      dialogConfig
    );

    authDialogRef.afterClosed().subscribe((result: any) => {
      if (result === null) {
        console.log('Canceled dialog or unvalid credentials');
        // do nothing
        return;
      } else {
        console.log('Log in or sign up user');
        // change ui to reflect, that we now have a logged in user
        return;
      }
    });
  }
}
