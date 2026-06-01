import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { CtaComponent } from './components/cta/cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    FeaturesComponent,
    ProductPreviewComponent,
    HowItWorksComponent,
    CtaComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
