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
  readonly primaryActionClasses =
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-5 py-3 text-base font-semibold leading-5 transition bg-[var(--app-red)] text-white hover:bg-red-700';

  readonly secondaryActionClasses =
    'inline-flex items-center justify-center gap-2 rounded-md border border-slate-900 px-5 py-3 text-base font-semibold leading-5 transition text-slate-950 hover:bg-slate-950 hover:text-white';
}
