import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomScheduleComponent } from './classroom-schedule.component';

describe('ClassroomScheduleComponent', () => {
    let component: ClassroomScheduleComponent;
    let fixture: ComponentFixture<ClassroomScheduleComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClassroomScheduleComponent],
        });
        fixture = TestBed.createComponent(ClassroomScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
