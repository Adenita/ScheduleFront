import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
    formData = {
        name: '',
        email: '',
        subject: '',
        message: '',
    };

    handleSubmit(): void {
        console.log('Contact form submitted:', this.formData);
    }
}
