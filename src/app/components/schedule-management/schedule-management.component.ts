import { Component, OnInit } from '@angular/core';
import { Schedule, ScheduleListTransport, ScheduleTransport } from '../../shared/models/schedule';
import { GeneticAlgorithmService } from '../../core/genetic-algorithm/genetic-algorithm.service';
import { Population } from '../../shared/models/population';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PopulationService } from '../../core/genetic-algorithm/population.service';
import { DepartmentService } from '../../core/http/department.service';
import { DepartmentDetailTransport } from '../../shared/models/department';
import { ScheduleService } from '../../core/genetic-algorithm/schedule.service';
import { ProgramTransport } from '../../shared/models/program';
import { ScheduleDataService } from '../../core/http/schedule-data.service';
import { EventTransport } from '../../shared/models/event';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleGenerationModalComponent } from '../schedule-generation-modal/schedule-generation-modal.component';

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.css'],
})
export class ScheduleManagementComponent implements OnInit {
  departmentId: number = 1;
  currentBestSchedule!: ScheduleTransport;
  departmentTransport: DepartmentDetailTransport;

  scheduleForProgram!: ScheduleTransport;
  currentProgramName: string = '';
  programScheduleMap: Map<number, ScheduleTransport>;

  populationSize: number = 200;
  generation: number = 1;
  bestScheduleEvents$: BehaviorSubject<EventTransport[]>;
  schedules$: BehaviorSubject<ScheduleTransport[]>;

  constructor(
    private modalService: NgbModal,
    private departmentService: DepartmentService,
    private scheduleService: ScheduleService,
    private populationService: PopulationService,
    private geneticAlgorithmService: GeneticAlgorithmService,
    private scheduleDataService: ScheduleDataService,
  ) {
    this.departmentTransport = {} as DepartmentDetailTransport;
    this.programScheduleMap = new Map<number, ScheduleTransport>();
    this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
    this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit() {
    this.getDepartmentData()
      .then((departmentData) => (this.departmentTransport = departmentData))
      .then(() => this.getSchedules());
  }

  async getDepartmentData() {
    return await firstValueFrom(this.departmentService.getDepartmentDetails(this.departmentId));
  }

  getSchedules(): void {
    this.scheduleDataService.getAll().subscribe({
      next: (scheduleListTransport: ScheduleListTransport) => {
        const schedules = scheduleListTransport.scheduleTransports;
        this.schedules$.next(schedules);
        this.currentBestSchedule = schedules[schedules.length - 1];
        this.setSchedulePerProgramMap(this.currentBestSchedule, this.departmentTransport.programTransports);
        this.setCurrentProgramSchedule();
      },
      error: (err) => console.error('Error fetching professors', err),
    });
  }

  setCurrentProgramSchedule() {
    const sch = this.programScheduleMap.get(1);
    if (sch) {
      this.currentProgramName = this.departmentTransport.programTransports[0].name;
      this.scheduleForProgram = sch;
    }
  }
  setSchedulePerProgramMap(schedule: ScheduleTransport, programs: ProgramTransport[]) {
    programs.forEach((program) => {
      const programSchedule = new Schedule();
      const events: EventTransport[] = this.currentBestSchedule.events.filter((event) => event.programTransport.id === program.id);
      events.sort((event1, event2) => event1.id - event2.id);
      programSchedule.events = events;
      programSchedule.fitness = 1;
      this.programScheduleMap.set(program.id, programSchedule);
    });
  }

  loadProgramSchedule(program: ProgramTransport) {
    this.currentProgramName = program.name;
    const schedule = this.programScheduleMap.get(program.id);
    if (schedule) {
      this.scheduleForProgram = schedule;
    }
  }

  selectSchedule(schedule: ScheduleTransport) {
    this.currentBestSchedule = schedule;
    this.setSchedulePerProgramMap(schedule, this.departmentTransport.programTransports);
    this.setCurrentProgramSchedule();
  }

  openGenerateScheduleModal() {
    const modalRef = this.modalService.open(ScheduleGenerationModalComponent);
    modalRef.componentInstance.bestScheduleEvents$ = this.bestScheduleEvents$;
    modalRef.componentInstance.schedules$ = this.schedules$;
    this.generateBestSchedule();
  }

  generateBestSchedule() {
    this.generation = 1;
    let population: Population = this.populationService.generatePopulation(this.populationSize, this.departmentTransport);
    const intervalId = setInterval(() => {
      population = this.geneticAlgorithmService.evolve(population, this.departmentTransport.timeslots);
      this.populationService.sortByFitness(population);
      this.bestScheduleEvents$.next(population.schedules[0].events);
      if (population.schedules[0].fitness === 1) {
        clearInterval(intervalId);
      }
      this.generation++;
    }, 250);
  }
}
