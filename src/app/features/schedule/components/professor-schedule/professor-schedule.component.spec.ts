import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorScheduleComponent } from './professor-schedule.component';

describe('ProfessorScheduleComponent', () => {
    let component: ProfessorScheduleComponent;
    let fixture: ComponentFixture<ProfessorScheduleComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProfessorScheduleComponent],
        });
        fixture = TestBed.createComponent(ProfessorScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
