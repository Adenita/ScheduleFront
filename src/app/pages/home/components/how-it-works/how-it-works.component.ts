import { Component } from '@angular/core';

@Component({
    selector: 'home-how-it-works',
    standalone: true,
    templateUrl: './how-it-works.component.html',
})
export class HowItWorksComponent {
    readonly steps = [
        {
            number: '01',
            key: 'data',
            title: 'Add data',
            description: 'Departments, professors, rooms, courses, and semesters.',
        },
        {
            number: '02',
            key: 'rules',
            title: 'Set rules',
            description: 'Availability, room requirements, capacities, and constraints.',
        },
        {
            number: '03',
            key: 'generate',
            title: 'Generate',
            description: 'The algorithm builds a timetable from your available resources.',
        },
        {
            number: '04',
            key: 'validate',
            title: 'Validate',
            description: 'Confirm the data can produce a valid schedule.',
        },
        {
            number: '05',
            key: 'publish',
            title: 'Publish',
            description: 'Share schedules with students and professors.',
        },
    ];}
