import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

/** component for displaying movie cards */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  userData = { Username: "", FavoriteMovies: [] };
  FavoriteMovies: any[] = [];
  isFavoriteMovie: boolean = false;

  /**
   * construtor for MovieCardComponent
   * @param fetchApiData - service for fetching data from the API
   * @param dialog - service for opening a dialog
   * @param snackBar - service for displaying snack bar messages
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {}

  /** lifecycle hook that is called after data-bound properties of directive are initialized */
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /** fetch all movies from the API */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * opens a dialog to view genre details
   * @param genre - the genre of the movie
   * @param description - the description of the genre
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px'
    });
  }

  /**
     * Opens a dialog displaying director details.
     * @param director - The name of the director.
     * @param bio - The biography of the director.
     * @param birthdate - The birthdate of the director.
     */
  openDirectorDialog(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      width: '450px',
    });
  }

  /**
    * Opens a dialog displaying movie synopsis.
    * @param movieName - The name of the movie.
    * @param description - The synopsis of the movie.
    */
  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log('Favorite Movies in getFavoriteMovie', this.FavoriteMovies);
  }

  /**
    * Checks if a movie is in the user's favorite list.
    * @param movie - The movie to check.
    * @returns True if the movie is in the favorite list, false otherwise.
    */
  isFavorite(movie: any): any {
    const MovieID = movie._id;
    if (this.FavoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
    * Toggles a movie in the user's favorite list.
    * @param movie - The movie to toggle.
    */
  toggleFavorite(movie: any): void {
    const isFavorite = this.isFavorite(movie);
    isFavorite
      ? this.deleteFavoriteMovies(movie)
      : this.addFavoriteMovies(movie);
  }

  /**
     * Adds a movie to the user's favorite list.
     * @param movie - The movie to add to favorites.
     */
  addFavoriteMovies(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.addFavoriteMovies(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies(); 
      this.snackBar.open('Movie added to your favorites successfully!', 'OK', {
        duration: 3000,
      });
    });
  }

  /**
     * Deletes a movie from the user's favorite list.
     * @param movie - The movie to remove from favorites.
     */
  deleteFavoriteMovies(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.deleteFavoriteMovies(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
      this.snackBar.open('Movie removed from your favorites successfully!', 'OK', {
        duration: 3000,
      });
    });
  }

}