import { Component } from '@angular/core';

@Component({
    selector: 'home-product-preview',
    standalone: true,
    templateUrl: './product-preview.component.html',
})
export class ProductPreviewComponent {
    readonly checkListItems = [
        'Automatic schedule generation',
        'Room and professor conflict reduction',
        'Clean schedule views for end users',
        'Future Google Calendar synchronization',
    ];
}
