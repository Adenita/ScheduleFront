import { Component } from '@angular/core';
import { Generate } from '../../core/services/generate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private generate: Generate) {}

  openGenerateModal() {
    this.generate.generate = true;
  }
}
