import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramManagementComponent } from './program-management.component';

describe('ProgramsListComponent', () => {
    let component: ProgramManagementComponent;
    let fixture: ComponentFixture<ProgramManagementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProgramManagementComponent],
        });
        fixture = TestBed.createComponent(ProgramManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
