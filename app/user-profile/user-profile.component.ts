import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/** import components */
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

/** component for user profile page */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = { Username: '', Password: '', Email: '', Birthday: '', FavoriteMovies: [] };

/** user object */
  user: any = {};
/** list all movies */
  movies: any[] = [];
/** list of favorite movies */
  FavoriteMovies: any[] = [];

  /**
   * constructs UserProfileComponent
   * @param fetchApiData - the service for fetching API data
   * @param dialog - the dialog service to display dialogs
   * @param snackBar - the snack bar service for displaying notifications
   * @param router - the service for navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  /** lifecycle hook called after component initialization */
  ngOnInit(): void {
    this.getProfile();
    this.getFavoriteMovies();
  }

  /** fetch user profile data */
  public getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    this.userData.Birthday = this.user.Birthday;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.FavoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
    });
  }

  /** fetch all movies */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /** fetch user's favorite movies */
  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log('Favorite Movies in getFavoriteMovie', this.FavoriteMovies);
  }

  /**
   * checks if a movie is in the user's favorites list
   * @param movie - the movie to check
   * @returns true if the movie is a favorite, otherwise it is false
   */
  isFavorite(movie: any): boolean {
    const MovieID = movie._id;
    if (this.FavoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * deletes a movie from the user's favorites list
   * @param movie - the movie to remove
   */
  deleteFavoriteMovies(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.deleteFavoriteMovies(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
      this. getProfile();
      this.snackBar.open('Movie deleted from your favorites list!', 'OK', {
        duration: 3000,
      });
    });
  }

  /** updates user data  */
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      console.log('User update success');
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User update successful', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.error('Error updating user:', error);
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000
      });
    });
  }

  /** delete the user's account */
  deleteUser(): void {
    this.router.navigate(['welcome']).then(() => {
      localStorage.clear();
      this.snackBar.open('User successfully deleted.', 'OK', {
        duration: 2000
      });
    })
    this.fetchApiData.deleteUser().subscribe((result) => {
      console.log(result);
    });
  }

  /**
   * opens a dialog to view genre information for that movie
   * @param genre  - the genre
   * @param description - description of the genre
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * opens a dialog to view the director info
   * @param name - the director's name
   * @param bio - the director's bio
   * @param birth - the director's birth year
   * @param death - year of director's death
   */
  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death
      },
      width: '450px',
    });
  }

  /**
   * opens a dialog to view a synopsis of the movie
   * @param description - the synopsis of the movie
   */
  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

}
