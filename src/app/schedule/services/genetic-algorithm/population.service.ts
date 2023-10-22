import { Injectable } from '@angular/core';
import { Schedule } from '../../shared/models/schedule';
import { ScheduleService } from './schedule.service';
import { Population } from '../../shared/models/population';
import { DepartmentDetailTransport } from '../../../shared/models/department';

@Injectable({
  providedIn: 'root',
})
export class PopulationService {
  constructor(private scheduleService: ScheduleService) {}

  generatePopulation(populationSize: number, departmentTransport: DepartmentDetailTransport): Population {
    let population: Population = new Population();
    for (let i: number = 0; i < populationSize; i++) {
      const schedule: Schedule = this.scheduleService.initialize(departmentTransport);

      if (schedule.fitness === 1) {
        population.schedules = [schedule];
        return population;
      }

      population.schedules.push(schedule);
    }

    return this.sortByFitness(population);
  }

  sortByFitness(population: Population): Population {
    population.schedules.sort((schedule1: Schedule, schedule2: Schedule) => schedule2.fitness - schedule1.fitness);
    return population;
  }

  rouletteWheelSelection(population: Population): Population {
    const totalFitness: number = this.calculateTotalFitness(population.schedules);
    const selectedPopulation: Population = new Population();
    const schedulesLength: number = population.schedules.length;

    for (let i: number = 0; i < schedulesLength; i++) {
      const randomNumber: number = Math.random() * totalFitness;
      let sumFitness = 0;

      for (const schedule of population.schedules) {
        const selectionProbability: number = schedule.fitness / totalFitness;
        sumFitness += selectionProbability;

        if (sumFitness >= randomNumber) {
          selectedPopulation.schedules.push(schedule);
          break;
        }
      }
    }

    return this.sortByFitness(selectedPopulation);
  }

  private calculateTotalFitness(schedules: Schedule[]): number {
    let totalFitness = 0;
    for (const schedule of schedules) {
      totalFitness += schedule.fitness;
    }
    return totalFitness;
  }
}
