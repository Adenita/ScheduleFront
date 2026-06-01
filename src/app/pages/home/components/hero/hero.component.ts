import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SchedulePreviewComponent } from '../schedule-preview/schedule-preview.component';

@Component({
    selector: 'home-hero',
    standalone: true,
    imports: [RouterLink, SchedulePreviewComponent],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
}
