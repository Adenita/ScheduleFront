import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramFormModalComponent } from './program-form-modal.component';

describe('ProgramFormModalComponent', () => {
    let component: ProgramFormModalComponent;
    let fixture: ComponentFixture<ProgramFormModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProgramFormModalComponent],
        });
        fixture = TestBed.createComponent(ProgramFormModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
