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
            professor: 'Prof. Arta Krasniqi',
            room: 'Room B12',
            start: '09:00',
            end: '10:30',
        },
        {
            accent: 'blue',
            title: 'Database Systems',
            professor: 'Prof. Mentor Gashi',
            room: 'Lab 204',
            start: '11:00',
            end: '12:30',
        },
        {
            accent: 'yellow',
            title: 'Software Engineering',
            professor: 'Prof. Elira Berisha',
            room: 'Room A08',
            start: '13:30',
            end: '15:00',
        },
    ];}
