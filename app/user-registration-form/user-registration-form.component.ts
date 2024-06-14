// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// this import brings in the API calls created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// this import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/** component for the user registration form */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {
  /** input for user registration data */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * constructs the UserRegistrationFormComponent
   * @param fetchApiData - the service for fetching API data
   * @param dialogRef - the dialog reference for the user registration form
   * @param snackBar - the snack bar service for displaying messages
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  /** lifecycle hook called after component initialization */
  ngOnInit(): void {
  }

  // this is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      // logic for a successful user registration goes here! (to be implemented)
      this.dialogRef.close(); // this will close the modal on success
      console.log(response);
      this.snackBar.open("User created successfully", 'OK', {
        duration: 2000
      });
    }, (response) => {
      console.log(response);
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }
}
