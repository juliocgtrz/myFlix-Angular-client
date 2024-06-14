import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/** component for displaying the movie synopsis in a dialog */
@Component({
  selector: 'app-movie-synopsis',
  templateUrl: './movie-synopsis.component.html',
  styleUrl: './movie-synopsis.component.scss'
})
export class MovieSynopsisComponent implements OnInit {

  /**
   * constructor for MovieSynopsisComponent
   * @param dialogRef - reference to the dialog opened by the component
   * @param data - data passed to the dialog, including movieName and description
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Description: string,
    }
  ) { }

  /** lifecycle hook that is called after data-bound properties of a directive are initialized */
  ngOnInit(): void {
  }

}
