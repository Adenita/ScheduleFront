import { Injectable } from '@angular/core';
import { Population } from '../shared/models/population';
import { PopulationService } from './genetic-algorithm/population.service';
import { GeneticAlgorithmService } from './genetic-algorithm/genetic-algorithm.service';
import { DepartmentScheduleDetailTransport } from '../../../shared/models/department';
import { BehaviorSubject } from 'rxjs';
import { EventTransport } from '../shared/models/event';

@Injectable({
  providedIn: 'root',
})
export class ScheduleGenerationService {
  constructor(
    private populationService: PopulationService,
    private geneticAlgorithmService: GeneticAlgorithmService,
  ) {}

  generateBestSchedule(
    generation: number,
    populationSize: number,
    departmentScheduleData: DepartmentScheduleDetailTransport,
    scheduleEvents$: BehaviorSubject<EventTransport[]>,
  ) {
    generation = 1;
    let population: Population = this.populationService.generatePopulation(populationSize, departmentScheduleData);
    const intervalId = setInterval(() => {
      population = this.geneticAlgorithmService.evolve(population, departmentScheduleData.timeslots);
      this.populationService.sortByFitness(population);
      scheduleEvents$.next(population.schedules[0].events);
      if (population.schedules[0].fitness === 1) {
        clearInterval(intervalId);
      }
      generation++;
    }, 90);
  }
}
