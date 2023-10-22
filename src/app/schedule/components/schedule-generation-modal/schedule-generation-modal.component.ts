import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTransport } from '../../shared/models/event';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleTransport } from '../../shared/models/schedule';
import { ScheduleDataService } from '../../../core/services/http/schedule-data.service';

@Component({
  selector: 'app-generate-schedule-modal',
  templateUrl: './schedule-generation-modal.component.html',
  styleUrls: ['./schedule-generation-modal.component.css'],
})
export class ScheduleGenerationModalComponent {
  @Input()
  bestScheduleEvents$!: BehaviorSubject<EventTransport[]>;

  @Input()
  schedules$!: BehaviorSubject<ScheduleTransport[]>;

  constructor(
    public activeModal: NgbActiveModal,
    public scheduleDataService: ScheduleDataService,
  ) {}
  closeModal() {
    this.activeModal.close();
  }

  saveSchedule() {
    const scheduleTransport: ScheduleTransport = {
      events: this.bestScheduleEvents$.getValue(),
      fitness: 1,
    } as ScheduleTransport;
    this.scheduleDataService.post(scheduleTransport).subscribe({
      next: (scheduleTransport: ScheduleTransport) => {
        this.schedules$.next([...this.schedules$.getValue(), scheduleTransport]);
        this.closeModal();
      },
    });
  }
}
