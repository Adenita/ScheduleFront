import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'home-how-it-works',
    standalone: true,
    imports: [NgClass],
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss'],
})
export class HowItWorksComponent {
    readonly steps = [
        {
            number: '01',
            key: 'data',
            icon: 'bi-database',
            title: 'Add data',
            description: 'Departments, professors, rooms, courses, and semesters.',
        },
        {
            number: '02',
            key: 'rules',
            icon: 'bi-sliders',
            title: 'Set rules',
            description: 'Availability, room requirements, capacities, and constraints.',
        },
        {
            number: '03',
            key: 'generate',
            icon: 'bi-magic',
            title: 'Generate',
            description: 'The algorithm builds a timetable from your available resources.',
        },
        {
            number: '04',
            key: 'validate',
            icon: 'bi-check2-circle',
            title: 'Validate',
            description: 'Confirm the data can produce a valid schedule.',
        },
        {
            number: '05',
            key: 'publish',
            icon: 'bi-send-check',
            title: 'Publish',
            description: 'Share schedules with students and professors.',
        },
    ];
}
