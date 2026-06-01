import { Component } from '@angular/core';

@Component({
  selector: 'home-how-it-works',
  standalone: true,
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
})
export class HowItWorksComponent {
  readonly steps = [
    {
      number: '01',
      title: 'Add university data',
      description:
        'Professors, subjects, rooms, groups, and constraints are added securely.',
    },
    {
      number: '02',
      title: 'Generate schedules',
      description:
        'The system uses genetic algorithms to search for better schedule combinations.',
    },
    {
      number: '03',
      title: 'Publish and view',
      description:
        'Users can access clean schedule views without exposing private management data.',
    },
  ];
}
