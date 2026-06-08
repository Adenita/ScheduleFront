import { Component } from '@angular/core';

@Component({
    selector: 'home-what-we-do',
    standalone: true,
    templateUrl: './what-we-do.component.html',
    styleUrls: ['./what-we-do.component.scss'],
})
export class WhatWeDoComponent {
    readonly capabilities = [
        {
            preview: 'data',
            title: 'Manage academic resources',
            description:
                'Keep departments, programs, subjects, professors, classrooms, student groups, and availability rules organized in one place.',
        },
        {
            preview: 'calendar',
            title: 'Build conflict-aware schedules',
            description:
                'Turn structured academic data into weekly timetables while reducing overlaps between professors, rooms, groups, and lessons.',
        },
        {
            preview: 'publish',
            title: 'Share clear timetable views',
            description:
                'Give administrators, professors, and students the schedule information relevant to them through simple, secure views.',
        },
    ];
}
