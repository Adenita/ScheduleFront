import { Component } from '@angular/core';

@Component({
    selector: 'home-product-preview',
    standalone: true,
    templateUrl: './product-preview.component.html',
    styleUrls: ['./product-preview.component.scss'],
})
export class ProductPreviewComponent {
    readonly calendarDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    readonly calendarSlots = [
        {
            time: '08:00',
            items: [
                { id: '08-mon', title: 'Algorithms', accent: 'blue' },
                { id: '08-tue' },
                { id: '08-wed' },
                { id: '08-thu' },
                { id: '08-fri', title: 'Databases', accent: 'blue' },
            ],
        },
        {
            time: '09:00',
            items: [
                { id: '09-mon' },
                { id: '09-tue', title: 'Networks', accent: 'green' },
                { id: '09-wed', title: 'Math', accent: 'purple' },
                { id: '09-thu' },
                { id: '09-fri' },
            ],
        },
        {
            time: '10:00',
            items: [
                { id: '10-mon', title: 'SE', accent: 'red' },
                { id: '10-tue' },
                { id: '10-wed', title: 'AI', accent: 'red' },
                { id: '10-thu', title: 'Labs', accent: 'red' },
                { id: '10-fri', title: 'DB', accent: 'red' },
            ],
        },
        {
            time: '11:00',
            items: [
                { id: '11-mon' },
                { id: '11-tue', title: 'Systems', accent: 'blue' },
                { id: '11-wed' },
                { id: '11-thu' },
                { id: '11-fri' },
            ],
        },
        {
            time: '12:00',
            items: [
                { id: '12-mon', title: 'Programming', accent: 'blue' },
                { id: '12-tue' },
                { id: '12-wed', title: 'Security', accent: 'blue' },
                { id: '12-thu', title: 'Cloud', accent: 'blue' },
                { id: '12-fri', title: 'UX', accent: 'purple' },
            ],
        },
    ];
}
