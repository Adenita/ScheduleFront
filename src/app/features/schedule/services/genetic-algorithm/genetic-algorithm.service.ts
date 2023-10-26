import { Injectable } from '@angular/core';
import { Population } from '../../shared/models/population';
import { Schedule } from '../../shared/models/schedule';
import { ScheduleService } from './schedule.service';
import { PopulationService } from './population.service';
import { Timeslot } from '../../../../shared/models/timeslots';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GeneticAlgorithmService {
  mutationRate: number = 0.1;
  crossoverRate: number = 0.9;
  eliteSchedules: number = 5;

  constructor(
    private scheduleService: ScheduleService,
    private populationService: PopulationService,
  ) {}

  evolve(population: Population, timeslots: Timeslot[]): Population {
    const crossoverPopulation = this.crossoverPopulation(population);
    return crossoverPopulation.schedules[0].fitness == 1
      ? crossoverPopulation
      : this.mutatePopulation(crossoverPopulation, timeslots);
  }

  crossoverPopulation(population: Population): Population {
    const populationSize: number = population.schedules.length;
    let crossoverPopulation: Population = new Population();
    const selectedPopulation: Population = this.selectPopulation(population);
    const eliteSchedules: Schedule[] = [];
    for (let i = 0; i < this.eliteSchedules; i++) {
      eliteSchedules.push(selectedPopulation.schedules[i]);
    }

    for (let i: number = this.eliteSchedules; i < populationSize; i++) {
      if (this.crossoverRate > Math.random()) {
        let randomIndex: number = this.getRandomIndex(populationSize);
        if (randomIndex == i) {
          randomIndex = i == populationSize - 1 ? i - 1 : i + 1;
        }

        const schedule1 = selectedPopulation.schedules[i];
        const schedule2 = selectedPopulation.schedules[randomIndex];
        const crossoverSchedule: Schedule = this.crossoverSchedule(schedule1, schedule2);
        if (crossoverSchedule.fitness == 1) {
          return this.getPopulationWithBestSchedule(crossoverSchedule, crossoverPopulation);
        }

        crossoverPopulation.schedules[i - this.eliteSchedules] = crossoverSchedule;
      } else {
        crossoverPopulation.schedules[i - this.eliteSchedules] = population.schedules[i];
      }
    }

    eliteSchedules.forEach((eliteSchedule: Schedule) => crossoverPopulation.schedules.push(eliteSchedule));
    crossoverPopulation = this.populationService.sortByFitness(crossoverPopulation);

    return crossoverPopulation;
  }

  getPopulationWithBestSchedule(schedule: Schedule, population: Population): Population {
    population.schedules = [schedule];
    return population;
  }

  crossoverSchedule(schedule1: Schedule, schedule2: Schedule): Schedule {
    const schedulesInOrder = this.getSchedulesByFitness(schedule1, schedule2);
    let bestSchedule: Schedule = schedulesInOrder.bestSchedule;
    let secondBestSchedule: Schedule = schedulesInOrder.secondBestSchedule;

    const eventsLength: number = bestSchedule.events.length;
    for (let i = 0; i < eventsLength; i++) {
      if (bestSchedule.events[i].conflict) {
        bestSchedule.events[i] = _.cloneDeep(secondBestSchedule.events[i]);
      }
    }

    bestSchedule.fitness = this.scheduleService.calculateFitness(bestSchedule);
    return bestSchedule;
  }

  getSchedulesByFitness(schedule1: Schedule, schedule2: Schedule) {
    let bestSchedule: Schedule;
    let secondBestSchedule: Schedule;

    if (schedule1.fitness > schedule2.fitness) {
      bestSchedule = _.cloneDeep(schedule1);
      secondBestSchedule = schedule2;
    } else {
      bestSchedule = _.cloneDeep(schedule2);
      secondBestSchedule = schedule1;
    }
    return { bestSchedule, secondBestSchedule };
  }
  selectPopulation(population: Population): Population {
    let selectedPopulation: Population = this.populationService.rouletteWheelSelection(population);

    const difference: number = population.schedules.length - selectedPopulation.schedules.length;
    if (difference > 0) {
      for (let i: number = 0; i < difference; i++) {
        selectedPopulation.schedules.push(population.schedules[i]);
      }
    }
    selectedPopulation = this.populationService.sortByFitness(selectedPopulation);
    return selectedPopulation;
  }

  mutatePopulation(population: Population, timeSlots: Timeslot[]): Population {
    const eliteSchedules: Schedule[] = [];

    for (let i = 0; i < this.eliteSchedules; i++) {
      let eliteSchedule = _.cloneDeep(population.schedules[i]);
      eliteSchedules.push(eliteSchedule);
    }

    for (let schedule of population.schedules) {
      schedule = this.mutateSchedule(schedule, timeSlots);
    }

    eliteSchedules.forEach((eliteSchedule: Schedule) => {
      population.schedules.push(eliteSchedule);
    });

    population = this.populationService.sortByFitness(population);

    for (let i = 0; i < this.eliteSchedules; i++) {
      population.schedules.pop();
    }

    return population;
  }

  mutateSchedule(schedule: Schedule, timeSlots: Timeslot[]): Schedule {
    const eventsLength = schedule.events.length;
    for (let x = 0; x < eventsLength; x++) {
      if (this.mutationRate > Math.random() && schedule.events[x].conflict) {
        schedule.events[x].timeslot = timeSlots[this.getRandomIndex(timeSlots.length)];
      }
    }
    schedule.fitness = this.scheduleService.calculateFitness(schedule);
    return schedule;
  }

  getRandomIndex(size: number): number {
    return Math.floor(Math.random() * size);
  }
}
