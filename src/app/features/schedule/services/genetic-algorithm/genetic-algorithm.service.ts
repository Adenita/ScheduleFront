import { Injectable } from '@angular/core';
import { Population } from '../../shared/models/population';
import { Schedule } from '../../shared/models/schedule';
import { PopulationService } from './population.service';
import { Timeslot } from '../../../../shared/models/timeslots';
import { FitnessService } from './fitness.service';
import { EventTransport } from '../../shared/models/event';

@Injectable({
    providedIn: 'root',
})
export class GeneticAlgorithmService {
    mutationRate: number = 0.2;
    crossoverRate: number = 0.75;
    eliteSchedules: number = 5;

    constructor(
        private populationService: PopulationService,
        private fitnessService: FitnessService,
    ) {}

    evolve(population: Population, timeslots: Timeslot[]): Population {
        const crossoverPopulation = this.crossoverPopulation(population);
        return crossoverPopulation.schedules[0].fitness == 1
            ? crossoverPopulation
            : this.mutatePopulation(crossoverPopulation, timeslots);
    }

    private crossoverPopulation(population: Population): Population {
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

    private crossoverSchedule(schedule1: Schedule, schedule2: Schedule): Schedule {
        const schedulesInOrder = this.getSchedulesByFitness(schedule1, schedule2);
        let bestSchedule: Schedule = schedulesInOrder.bestSchedule;
        let secondBestSchedule: Schedule = schedulesInOrder.secondBestSchedule;

        const eventsLength: number = bestSchedule.events.length;
        for (let i = 0; i < eventsLength; i++) {
            if (bestSchedule.events[i].conflict) {
                bestSchedule.events[i] = this.cloneEvent(secondBestSchedule.events[i]);
            }
        }

        bestSchedule.fitness = this.fitnessService.calculateFitness(bestSchedule);
        return bestSchedule;
    }

    private getSchedulesByFitness(schedule1: Schedule, schedule2: Schedule) {
        let bestSchedule: Schedule;
        let secondBestSchedule: Schedule;

        if (schedule1.fitness > schedule2.fitness) {
            bestSchedule = this.cloneSchedule(schedule1);
            secondBestSchedule = schedule2;
        } else {
            bestSchedule = this.cloneSchedule(schedule2);
            secondBestSchedule = schedule1;
        }
        return { bestSchedule, secondBestSchedule };
    }

    private selectPopulation(population: Population): Population {
        let selectedPopulation: Population = this.rouletteWheelSelection(population);

        const difference: number = population.schedules.length - selectedPopulation.schedules.length;
        if (difference > 0) {
            for (let i: number = 0; i < difference; i++) {
                selectedPopulation.schedules.push(population.schedules[i]);
            }
        }
        selectedPopulation = this.populationService.sortByFitness(selectedPopulation);
        return selectedPopulation;
    }

    private mutatePopulation(population: Population, timeSlots: Timeslot[]): Population {
        const eliteSchedules: Schedule[] = [];

        for (let i = 0; i < this.eliteSchedules; i++) {
            let eliteSchedule = this.cloneSchedule(population.schedules[i]);
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

    private mutateSchedule(schedule: Schedule, timeSlots: Timeslot[]): Schedule {
        const eventsLength = schedule.events.length;
        for (let x = 0; x < eventsLength; x++) {
            if (this.mutationRate > Math.random() && schedule.events[x].conflict) {
                schedule.events[x].timeslot = timeSlots[this.getRandomIndex(timeSlots.length)];
            }
        }
        schedule.fitness = this.fitnessService.calculateFitness(schedule);
        return schedule;
    }

    private rouletteWheelSelection(population: Population): Population {
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

        return this.populationService.sortByFitness(selectedPopulation);
    }

    private calculateTotalFitness(schedules: Schedule[]): number {
        let totalFitness = 0;
        for (const schedule of schedules) {
            totalFitness += schedule.fitness;
        }
        return totalFitness;
    }

    getRandomIndex(size: number): number {
        return Math.floor(Math.random() * size);
    }

    private cloneSchedule(schedule: Schedule): Schedule {
        const clone = new Schedule();
        clone.id = schedule.id;
        clone.fitness = schedule.fitness;
        clone.events = schedule.events.map((event) => this.cloneEvent(event));
        clone.conflicts = schedule.conflicts.map((conflict) => ({
            ...conflict,
            event: this.cloneEvent(conflict.event),
            nextEvent: this.cloneEvent(conflict.nextEvent),
        }));
        return clone;
    }

    private cloneEvent(event: EventTransport): EventTransport {
        return structuredClone(event);
    }
}
