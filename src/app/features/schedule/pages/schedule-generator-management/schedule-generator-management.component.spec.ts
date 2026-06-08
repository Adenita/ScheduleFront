import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleGeneratorManagementComponent } from './schedule-generator-management.component';

describe('ScheduleGeneratorManagementComponent', () => {
    let component: ScheduleGeneratorManagementComponent;
    let fixture: ComponentFixture<ScheduleGeneratorManagementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScheduleGeneratorManagementComponent],
        });
        fixture = TestBed.createComponent(ScheduleGeneratorManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
