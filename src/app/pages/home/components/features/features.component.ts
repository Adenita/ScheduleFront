import { Component } from '@angular/core';

@Component({
    selector: 'home-features',
    standalone: true,
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
    readonly features = [
        {
            icon: 'bi-magic',
            badge: 'Generator',
            title: 'Genetic Algorithm Scheduling',
            description: 'Generate schedules automatically using optimization logic that helps reduce conflicts.',
        },
        {
            icon: 'bi-search',
            badge: 'Lookup',
            title: 'Easy Schedule Lookup',
            description: 'Students and professors can quickly find their own timetable without browsing private data.',
        },
        {
            icon: 'bi-database-lock',
            badge: 'Secure',
            title: 'Secure Data Management',
            description: 'Department data stays protected and is only available to authenticated users.',
        },
    ];
}
