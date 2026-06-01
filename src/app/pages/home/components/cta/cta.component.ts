import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
})
export class CtaComponent {
  readonly primaryActionClasses =
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-5 py-3 text-base font-semibold leading-5 transition bg-[var(--app-red)] text-white hover:bg-red-700 mr-2';

  readonly secondaryActionClasses =
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-5 py-3 text-base font-semibold leading-5 transition bg-white text-slate-950 hover:bg-slate-100';
}
