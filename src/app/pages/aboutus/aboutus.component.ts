import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-aboutus',
    standalone: false,
    templateUrl: './aboutus.component.html',
    styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent {
    readonly principles = [
        {
            icon: 'bi bi-compass',
            title: 'Simplicity first',
            description:
                'Academic scheduling can quickly become complicated. ScheduleUP is designed to keep the process clear, structured, and easy to understand.',
        },
        {
            icon: 'bi bi-lightning-charge',
            title: 'Automation with control',
            description:
                'Automation should support decision-making, not remove it. ScheduleUP helps generate schedules while keeping administrators in control.',
        },
        {
            icon: 'bi bi-diagram-3',
            title: 'Built around real workflows',
            description:
                'Every part of ScheduleUP is shaped around real university scheduling needs, from data management to public timetable access.',
        },
    ];

    readonly journey = [
        {
            year: '2024',
            title: 'Initial idea',
            description:
                'ScheduleUP started as a response to the difficulty of managing university schedules manually.',
        },
        {
            year: '2025',
            title: 'Scheduling engine',
            description:
                'The platform introduced automatic schedule generation, conflict checking, and structured academic data management.',
        },
        {
            year: '2026',
            title: 'Platform redesign',
            description:
                'ScheduleUP is being refined with a stronger focus on usability, clean interfaces, and easier access for students and staff.',
        },
    ];

    readonly stack = [
        'Angular',
        'TypeScript',
        'Tailwind CSS',
        'Spring Boot',
        'Maven',
        'Docker',
        'PostgreSQL',
    ];
}
