import { Component, Input } from '@angular/core';
import { BehaviorSubject, count } from 'rxjs';
import { EventTransport } from '../../shared/models/event';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleTransport } from '../../shared/models/schedule';
import { ScheduleService } from '../../core/genetic-algorithm/schedule.service';
import { ScheduleDataService } from '../../core/http/schedule-data.service';

@Component({
  selector: 'app-generate-schedule-modal',
  templateUrl: './schedule-generation-modal.component.html',
  styleUrls: ['./schedule-generation-modal.component.css'],
})
export class ScheduleGenerationModalComponent {
  @Input()
  bestScheduleEvents$!: BehaviorSubject<EventTransport[]>;

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
      next: () => {
        this.closeModal();
      },
    });
  }
}
