import { Injectable } from '@angular/core';
import { Schedule } from '../../shared/models/schedule';
import { ScheduleService } from './schedule.service';
import { Population } from '../../shared/models/population';
import { DepartmentScheduleDetailTransport } from '../../../../shared/models/department';

@Injectable({
    providedIn: 'root',
})
export class PopulationService {
    constructor(private scheduleService: ScheduleService) {}

    generatePopulation(populationSize: number, departmentTransport: DepartmentScheduleDetailTransport): Population {
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
}
