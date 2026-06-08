import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { WhatWeDoComponent } from './components/what-we-do/what-we-do.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { CtaComponent } from './components/cta/cta.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeroComponent, WhatWeDoComponent, ProductPreviewComponent, HowItWorksComponent, CtaComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
