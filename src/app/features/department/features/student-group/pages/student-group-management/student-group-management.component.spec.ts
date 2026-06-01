import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroupManagementComponent } from './student-group-management.component';

describe('StudentGroupsListComponent', () => {
    let component: StudentGroupManagementComponent;
    let fixture: ComponentFixture<StudentGroupManagementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StudentGroupManagementComponent],
        });
        fixture = TestBed.createComponent(StudentGroupManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
