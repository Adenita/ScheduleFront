import { Component, OnInit } from '@angular/core';
import { ScheduleListTransport, ScheduleTransport } from '../../shared/models/schedule';
import { GeneticAlgorithmService } from '../../services/genetic-algorithm/genetic-algorithm.service';
import { Population } from '../../shared/models/population';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PopulationService } from '../../services/genetic-algorithm/population.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { DepartmentDetailTransport, DepartmentScheduleDetailTransport } from '../../../../shared/models/department';
import { ScheduleService } from '../../services/genetic-algorithm/schedule.service';
import { ProgramTransport } from '../../../../shared/models/program';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { EventTransport } from '../../shared/models/event';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleGenerationModalComponent } from '../../components/schedule-generation-modal/schedule-generation-modal.component';
import { Classroom } from '../../../../shared/models/classroom';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ProfessorTransport } from '../../../../shared/models/professor';

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.css'],
})
export class ScheduleManagementComponent implements OnInit {
  departmentId: number = -1;
  currentBestSchedule!: ScheduleTransport;
  departmentScheduleDetailTransport: DepartmentScheduleDetailTransport;
  departmentTransport: DepartmentDetailTransport;

  currentRoute: string = '';

  populationSize: number = 200;
  generation: number = 1;
  bestScheduleEvents$: BehaviorSubject<EventTransport[]>;
  schedules$: BehaviorSubject<ScheduleTransport[]>;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private scheduleService: ScheduleService,
    private populationService: PopulationService,
    private geneticAlgorithmService: GeneticAlgorithmService,
    private scheduleDataService: ScheduleDataService,
    private routeParametersService: RouteParametersService,
  ) {
    this.departmentTransport = {} as DepartmentDetailTransport;
    this.departmentScheduleDetailTransport = {} as DepartmentScheduleDetailTransport;
    this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
    this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit() {
    this.getRouteParameters()
      .then(() => this.getDepartmentData())
      .then((departmentData) => (this.departmentTransport = departmentData))
      .then(() => this.getDepartmentScheduleDetails())
      .then((departmentData) => (this.departmentScheduleDetailTransport = departmentData))
      .then(() => this.getSchedules());
  }

  async getDepartmentScheduleDetails() {
    return await firstValueFrom(this.departmentService.getDepartmentScheduleDetails(this.departmentId));
  }

  async getDepartmentData() {
    return await firstValueFrom(this.departmentService.getDepartmentDetails(this.departmentId));
  }

  getRouteParameters() {
    return this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('schedules');
    });
  }

  getSchedules(): void {
    this.scheduleDataService.getAll().subscribe({
      next: (scheduleListTransport: ScheduleListTransport) => {
        const schedules = scheduleListTransport.scheduleTransports;
        this.schedules$.next(schedules);
        this.currentBestSchedule = schedules[schedules.length - 1];
      },
      error: (err) => console.error('Error fetching professors', err),
    });
  }

  loadProgramSchedule(program: ProgramTransport) {
    this.router.navigate([this.currentRoute, this.currentBestSchedule.id, 'programs', program.id]);
  }

  loadClassroomSchedule(classroom: Classroom) {
    this.router.navigate([this.currentRoute, this.currentBestSchedule.id, 'classrooms', classroom.id]);
  }

  loadProfessorSchedule(professor: ProfessorTransport) {
    this.router.navigate([this.currentRoute, this.currentBestSchedule.id, 'professors', professor.id]);
  }

  selectSchedule(schedule: ScheduleTransport) {
    this.currentBestSchedule = schedule;
  }

  openGenerateScheduleModal() {
    const modalRef = this.modalService.open(ScheduleGenerationModalComponent);
    modalRef.componentInstance.bestScheduleEvents$ = this.bestScheduleEvents$;
    modalRef.componentInstance.schedules$ = this.schedules$;
    modalRef.componentInstance.departmentId = this.departmentId;
    this.generateBestSchedule();
  }

  generateBestSchedule() {
    this.generation = 1;
    let population: Population = this.populationService.generatePopulation(
      this.populationSize,
      this.departmentScheduleDetailTransport,
    );
    const intervalId = setInterval(() => {
      population = this.geneticAlgorithmService.evolve(population, this.departmentScheduleDetailTransport.timeslots);
      this.populationService.sortByFitness(population);
      this.bestScheduleEvents$.next(population.schedules[0].events);
      if (population.schedules[0].fitness === 1) {
        clearInterval(intervalId);
      }
      this.generation++;
    }, 90);
  }
}
