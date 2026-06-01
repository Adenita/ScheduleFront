import { Component } from '@angular/core';

@Component({
  selector: 'home-schedule-preview',
  standalone: true,
  templateUrl: './schedule-preview.component.html',
  styleUrls: ['./schedule-preview.component.scss'],
})
export class SchedulePreviewComponent {
  readonly schedulePreviewRows = [
    {
      accent: 'red',
      title: 'Algorithms',
      details: 'Prof. Arta Krasniqi',
      time: '09:00',
    },
    {
      accent: 'blue',
      title: 'Databases',
      details: 'Lab 204',
      time: '11:00',
    },
    {
      accent: 'yellow',
      title: 'Software Engineering',
      details: 'Room B12',
      time: '13:30',
    },
  ];
}
