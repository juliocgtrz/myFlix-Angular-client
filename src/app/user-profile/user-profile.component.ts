import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = { username: '', password: '', email: '', birthday: '' };

  formUserData: any = {
    username: '',
    password: '',
    email: '',
    birthday: '',
    favoriteMovie: []
  };
/** user object */
  user: any = {};
/** list all movies */
  movies: any[] = [];
/** list of favorite movies */
  favoriteMovies: any[] = [];
/** list of favorite movie IDs */
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getProfile();
    this.getMovies();
    this.getFavoriteMovies();
  }

  public getProfile(): void {
    this.fetchApiData.getUser().subscribe((response: any) => {
      console.log('response:', response.favoritemovie);
      this.user = response;
      this.userData.userName = this.user.userName;
      this.userData.email = this.user.email;
      if (this.user.birthday) {
        let Birthday = new Date(this.user.birthday);
        if (!isNaN(Birthday.getTime())) {
          this.userData.birthday = Birthday.toISOString().split('T')[0];
        }
      }
      this.formUserData = { ...this.userData };
      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoritemovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
      });
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      if (Array.isArray(response)) {
        this.movies = response;
      }
      return this.movies;
    });
  }

  isFav(movie: any): boolean {
    return this.favoriteMoviesIDs.includes(movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite
      ? this.deleteFavMovies(movie)
      : this.addFavMovies(movie);
  }

  addFavMovies(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData.addFavouriteMovies(user.userName, movie._id).subscribe((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.getFavMovies(); // Refresh favorite movies after adding a new one
        this.snackBar.open(`${movie.movieName} has been added to your favorites`, 'OK', {
          duration: 1000,
        });
      });
    }
  }

  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.userData.UserId = parsedUser._id;
      this.fetchApiData.deleteFavoriteMovie(parsedUser.userName, movie._id).subscribe((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        // Remove the movie ID from the favoritemovie array
        this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
        // Fetch the user's favorite movies again to update the movie list
        this.getFavMovies();
        // Show a snack bar message
        this.snackBar.open(`${movie.movieName} has been removed from your favorites`, 'OK', {
          duration: 1000,
        });
      });
    }
  }

  updateUser(): void {
    this.fetchApiData.updateUser(this.formUserData).subscribe((response) => {
      console.log('User update success:', response);
      localStorage.setItem('user', JSON.stringify(response));
      this.snackBar.open('User updated successfully!', 'OK', {
        duration: 2000,
      });
      this.getProfile();
    }, (error) => {
      console.log('Error updating user:', error);
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000,
      });
    });
  }

  async deleteUser(): Promise<void> {
    console.log('deleteUser function called:', this.userData.email)
    if (confirm('Do you want to delete your account?')) {
      this.fetchApiData.deleteUser().subscribe(() => {
        this.snackBar.open('Account deleted successfully!', 'OK', {
          duration: 3000,
        });
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }

  openGenreDialog(genre: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        genre: genre,
        description: description
      },
      width: '500px',
    });
  }

  openDirectorDialog(director: string, bio: string, birthdate: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        director: director,
        bio: bio,
        birthdate: birthdate,
      },
      width: '500px',
    });
  }

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        movieName: movieName,
        description: description
      },
      width: '500px',
    });
  }

}
