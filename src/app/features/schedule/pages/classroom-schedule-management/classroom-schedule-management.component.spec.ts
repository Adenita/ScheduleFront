import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomScheduleManagementComponent } from './classroom-schedule-management.component';

describe('ClassroomScheduleManagementComponent', () => {
    let component: ClassroomScheduleManagementComponent;
    let fixture: ComponentFixture<ClassroomScheduleManagementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClassroomScheduleManagementComponent],
        });
        fixture = TestBed.createComponent(ClassroomScheduleManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
