import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrl: './genre-info.component.scss'
})
export class GenreInfoComponent implements OnInit {

  /**
   * constructor for GenreInfoComponent
   * @param data - data injected into the component containing genre info
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string,
      Description: string
    }
  ) { }
  
  ngOnInit(): void {
  }

}
