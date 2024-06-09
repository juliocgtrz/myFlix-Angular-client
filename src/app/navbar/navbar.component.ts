import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/** component for the navigation bar displayed at the top of the screen */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  /** username of the user when logged-in */
  public Username: string = "";

  /**
   * constructor for NavbarComponent
   * @param snackBar - angular material service for displaying snackbar messages
   * @param router - angular service for navigating between routes
   */
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  /** lifecycle hook that is called after data-bound properties of a directive are initialized */
  ngOnInit(): void {
    this.Username = JSON.parse(localStorage.getItem("user")!).Username;
  }

  /** function to navigate to the movies page */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /** function to navigate to the profile page */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /** function for user to logout */
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been logged out successfully', 'OK', {
      duration: 2000,
    });
  }

}
