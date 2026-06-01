import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserTransport } from '../../shared/models/user';

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input()
    collapsed: boolean = false;

    @Input()
    isAdmin: boolean = false;

    @Input()
    isProfessor: boolean = false;

    @Input()
    username: string | null = '';

    @Input()
    currentUser?: UserTransport;

    @Output()
    toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    logoutClick: EventEmitter<void> = new EventEmitter<void>();
}
